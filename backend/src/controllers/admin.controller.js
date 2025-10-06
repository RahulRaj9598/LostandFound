import httpStatus from 'http-status';
import User from '../models/User.js';
import Claim from '../models/Claim.js';
import { sendEmail } from '../services/email.service.js';
import Post from '../models/Post.js';

export async function listPendingUsers(req, res, next) {
  try {
    const users = await User.find({ status: 'PENDING_APPROVAL' })
      .select('-passwordHash')
      .sort({ createdAt: 1 })
      .limit(100);
    
    // Add additional info for admin decision making
    const usersWithInfo = users.map(user => ({
      ...user.toObject(),
      emailVerified: user.emailVerified,
      daysSinceSignup: Math.floor((Date.now() - user.createdAt) / (1000 * 60 * 60 * 24)),
      needsManualApproval: !user.emailVerified // Users who missed email verification
    }));
    
    return res.json(usersWithInfo);
  } catch (err) { next(err); }
}

export async function approveUser(req, res, next) {
  try {
    const { skipEmailVerification } = req.body; // Optional: skip email verification requirement
    
    const updateData = { status: 'ACTIVE' };
    
    // If admin wants to skip email verification (for users who missed the OTP)
    if (skipEmailVerification === true) {
      updateData.emailVerified = true;
    }
    
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    
    // Send notification email to user about manual approval
    try {
      await sendEmail({
        to: user.email,
        subject: 'Account Approved - FindMyStuff',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">🎉 Account Approved!</h2>
            <p>Your FindMyStuff account has been manually approved by an administrator.</p>
            <p>You can now:</p>
            <ul>
              <li>Create and manage posts</li>
              <li>Claim found items</li>
              <li>Access all platform features</li>
            </ul>
            <p>Welcome to FindMyStuff!</p>
            <br/>
            <p>Here is the link to login:</p>
            <a href="https://lostand-found-kappa.vercel.app">https://lostand-found-kappa.vercel.app/</a>
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              This approval was done manually by an administrator.
            </p>
          </div>
        `
      });
    } catch (emailErr) {
      // Don't fail the approval if email fails
      console.error('Failed to send approval email:', emailErr.message);
    }
    
    return res.json({ 
      id: user._id, 
      status: user.status, 
      emailVerified: user.emailVerified,
      message: 'User approved successfully'
    });
  } catch (err) { next(err); }
}

export async function rejectUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'REJECTED' }, { new: true });
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    return res.json({ id: user._id, status: user.status });
  } catch (err) { next(err); }
}

export async function approveUsersWithoutEmailVerification(req, res, next) {
  try {
    // Find users who are PENDING_APPROVAL and haven't verified their email
    const usersToApprove = await User.find({ 
      status: 'PENDING_APPROVAL', 
      emailVerified: false 
    });
    
    if (usersToApprove.length === 0) {
      return res.json({ 
        message: 'No users found that need manual approval',
        approvedCount: 0 
      });
    }
    
    // Approve all users and mark email as verified
    const updateResult = await User.updateMany(
      { 
        status: 'PENDING_APPROVAL', 
        emailVerified: false 
      },
      { 
        status: 'ACTIVE', 
        emailVerified: true 
      }
    );
    
    // Send notification emails to all approved users
    const approvedUsers = await User.find({ 
      status: 'ACTIVE', 
      emailVerified: true 
    }).limit(usersToApprove.length);
    
    for (const user of approvedUsers) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Account Approved - FindMyStuff',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">🎉 Account Approved!</h2>
              <p>Your FindMyStuff account has been manually approved by an administrator.</p>
              <p>You can now:</p>
              <ul>
                <li>Create and manage posts</li>
                <li>Claim found items</li>
                <li>Access all platform features</li>
              </ul>
              <p>Welcome to FindMyStuff!</p>
              <br/>
              <p>Here is the link to login:</p>
              <a href="https://lostand-found-kappa.vercel.app">https://lostand-found-kappa.vercel.app/</a>
              <hr style="margin: 20px 0;">
              <p style="color: #666; font-size: 14px;">
                This approval was done manually by an administrator.
              </p>
            </div>
          `
        });
      } catch (emailErr) {
        console.error(`Failed to send approval email to ${user.email}:`, emailErr.message);
      }
    }
    
    return res.json({ 
      message: 'Users approved successfully',
      approvedCount: updateResult.modifiedCount,
      emailsSent: approvedUsers.length
    });
  } catch (err) { next(err); }
}

export async function listPendingFoundClaims(req, res, next) {
  try {
    // Find PENDING claims where the related post is of type FOUND
    const claims = await Claim.find({ status: 'PENDING' }).sort({ createdAt: 1 }).limit(100);
    const postIds = claims.map(c => c.postId);
    const posts = await Post.find({ _id: { $in: postIds }, type: 'FOUND' }).select('_id type title ownerId');
    const foundPostIdSet = new Set(posts.map(p => String(p._id)));
    const filtered = claims.filter(c => foundPostIdSet.has(String(c.postId)));
    return res.json(filtered);
  } catch (err) { next(err); }
}

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('-passwordHash');
    return res.json(users);
  } catch (err) { next(err); }
}

export async function moderateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { action } = req.body; // SUSPEND_1WEEK | TERMINATE | LEAVE
    const user = await User.findById(id);
    if (!user) return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    if (action === 'SUSPEND_1WEEK') {
      const until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      user.status = 'SUSPENDED';
      user.suspendedUntil = until;
      await user.save();
      await sendEmail({ to: user.email, subject: 'Account suspended', html: `<p>Your account has been suspended until ${until.toUTCString()} due to policy violations.</p>` });
    } else if (action === 'TERMINATE') {
      user.terminatedAt = new Date();
      await user.save();
      await sendEmail({ to: user.email, subject: 'Account terminated', html: `<p>Your account has been terminated due to repeated violations.</p>` });
      await User.deleteOne({ _id: user._id });
    } else {
      // LEAVE - reset flags if desired
      user.flaggedForReview = false;
      await user.save();
      await sendEmail({ to: user.email, subject: 'Account reviewed', html: `<p>Your account has been reviewed and no action was taken.</p>` });
    }
    return res.json({ message: 'ok' });
  } catch (err) { next(err); }
}

export async function decideFoundClaim(req, res, next) {
  try {
    const { id } = req.params;
    const { decision } = req.body; // 'APPROVE' | 'DENY'
    const claim = await Claim.findById(id);
    if (!claim) return res.status(httpStatus.NOT_FOUND).json({ error: 'Claim not found' });
    const post = await Post.findById(claim.postId);
    if (!post) return res.status(httpStatus.NOT_FOUND).json({ error: 'Related post not found' });
    if (post.type !== 'FOUND') return res.status(httpStatus.BAD_REQUEST).json({ error: 'Only FOUND claims need admin decision' });

    if (decision === 'APPROVE') {
      claim.status = 'ACCEPTED';
      claim.adminDecision = 'APPROVED';
      await claim.save();
      await Post.findByIdAndUpdate(post._id, { status: 'RESOLVED', claimId: claim._id });
      return res.json({ id: claim._id, status: claim.status, adminDecision: claim.adminDecision });
    }
    if (decision === 'DENY') {
      claim.status = 'REJECTED';
      claim.adminDecision = 'DENIED';
      await claim.save();
      return res.json({ id: claim._id, status: claim.status, adminDecision: claim.adminDecision });
    }
    return res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid decision' });
  } catch (err) { next(err); }
}


