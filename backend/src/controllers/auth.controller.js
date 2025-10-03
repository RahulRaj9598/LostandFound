// Business logic only; routes remain thin.
import httpStatus from 'http-status';
import User from '../models/User.js';
import Session from '../models/Session.js';
import { hashPassword, verifyPassword, signAccessToken, signRefreshToken, verifyRefreshToken, hashToken } from '../services/auth.service.js';
import { issueEmailOtp, verifyEmailOtp as verifyOtpSvc } from '../services/otp.service.js';

export async function signup(req, res, next) {
  try {
    const { email, password, name } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(httpStatus.CONFLICT).json({ error: 'Email already in use' });
    const passwordHash = password ? await hashPassword(password) : undefined;
    const user = await User.create({
      email,
      passwordHash,
      profile: { name },
      status: 'PENDING_APPROVAL',
      emailVerified: false
    });
    await issueEmailOtp(user._id, 'VERIFY', email);
    return res.status(httpStatus.CREATED).json({ id: user._id, email: user.email, status: user.status });
  } catch (err) { next(err); }
}

export async function verifyEmailOtp(req, res, next) {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    const ok = await verifyOtpSvc(user._id, 'VERIFY', code);
    if (!ok) return res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid or expired code' });
    user.emailVerified = true;
    // Activate account immediately after email verification (no admin approval needed)
    user.status = 'ACTIVE';
    await user.save();
    return res.json({ message: 'Email verified', status: user.status });
  } catch (err) { next(err); }
}

export async function loginWithPassword(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Invalid credentials' });
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Invalid credentials' });
    if (user.status !== 'ACTIVE') return res.status(httpStatus.FORBIDDEN).json({ error: 'Account not active' });
    const accessTtlMs = Number(process.env.ACCESS_TTL_MS || 15 * 60 * 1000);
    const refreshTtlMs = Number(process.env.REFRESH_TTL_MS || 2 * 24 * 60 * 60 * 1000);
    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id, role: user.role });
    const refreshTokenHash = await hashToken(refreshToken);
    await Session.create({ userId: user._id, refreshTokenHash, userAgent: req.get('user-agent'), ip: req.ip, expiresAt: new Date(Date.now() + refreshTtlMs) });
    return res.json({ accessToken, refreshToken });
  } catch (err) { next(err); }
}

export async function requestLoginOtp(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    await issueEmailOtp(user._id, 'LOGIN', email);
    return res.json({ message: 'OTP sent' });
  } catch (err) { next(err); }
}

export async function loginWithOtp(req, res, next) {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Invalid credentials' });
    const ok = await verifyOtpSvc(user._id, 'LOGIN', code);
    if (!ok) return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Invalid code' });
    if (user.status !== 'ACTIVE') return res.status(httpStatus.FORBIDDEN).json({ error: 'Account not active' });
    const accessTtlMs = Number(process.env.ACCESS_TTL_MS || 15 * 60 * 1000);
    const refreshTtlMs = Number(process.env.REFRESH_TTL_MS || 2 * 24 * 60 * 60 * 1000);
    const accessToken = signAccessToken({ sub: user._id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id, role: user.role });
    const refreshTokenHash = await hashToken(refreshToken);
    await Session.create({ userId: user._id, refreshTokenHash, userAgent: req.get('user-agent'), ip: req.ip, expiresAt: new Date(Date.now() + refreshTtlMs) });
    return res.json({ accessToken, refreshToken });
  } catch (err) { next(err); }
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body;
    const payload = verifyRefreshToken(refreshToken);
    const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });
    return res.json({ accessToken });
  } catch (err) { next(err); }
}

export async function logout(req, res, next) {
  try {
    // For project scope: client deletes tokens. Optionally, we could flag session by id.
    return res.json({ message: 'Logged out' });
  } catch (err) { next(err); }
}

export async function logoutAll(req, res, next) {
  try {
    const { userId } = req.body; // from auth in real app
    await Session.updateMany({ userId }, { revokedAt: new Date() });
    return res.json({ message: 'All sessions revoked' });
  } catch (err) { next(err); }
}


