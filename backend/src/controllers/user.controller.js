import httpStatus from 'http-status';
import User from '../models/User.js';
import { configureCloudinary, uploadBufferToCloudinary } from '../services/upload.service.js';

export async function getMe(req, res, next) {
  try {
    const userId = req.user?.sub || req.headers['x-user-id'] || req.query.userId;
    if (!userId) return res.status(httpStatus.BAD_REQUEST).json({ error: 'userId missing' });
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) { next(err); }
}

export async function updateMe(req, res, next) {
  try {
    const userId = req.user?.sub || req.headers['x-user-id'] || req.body.userId;
    if (!userId) return res.status(httpStatus.BAD_REQUEST).json({ error: 'userId missing' });
    const { name, phone, avatarUrl, contactPrefs, notificationPrefs, location } = req.body;
    const update = {};
    if (name !== undefined) update['profile.name'] = name;
    if (phone !== undefined) update['profile.phone'] = phone;
    if (avatarUrl !== undefined) update['profile.avatarUrl'] = avatarUrl;
    if (location !== undefined) update['profile.location'] = location;
    if (contactPrefs !== undefined) update['profile.contactPrefs'] = contactPrefs;
    if (notificationPrefs !== undefined) update['notificationPrefs'] = notificationPrefs;
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-passwordHash');
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) { next(err); }
}

export async function getPublicProfile(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('profile.name profile.avatarUrl createdAt');
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) { next(err); }
}

export async function uploadAvatar(req, res, next) {
  try {
    const userId = req.user?.sub || req.headers['x-user-id'] || req.body.userId;
    if (!userId) return res.status(httpStatus.BAD_REQUEST).json({ error: 'userId missing' });
    if (!req.file) return res.status(httpStatus.BAD_REQUEST).json({ error: 'No file uploaded' });
    configureCloudinary();
    const result = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname, `findmystuff/avatars/${userId}`);
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { 'profile.avatarUrl': result.secure_url } },
      { new: true }
    ).select('-passwordHash');
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    return res.json(user);
  } catch (err) { next(err); }
}


