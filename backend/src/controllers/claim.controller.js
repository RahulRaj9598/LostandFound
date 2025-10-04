import httpStatus from 'http-status';
import Post from '../models/Post.js';
import Claim from '../models/Claim.js';
import { configureCloudinary, uploadBufferToCloudinary } from '../services/upload.service.js';
import User from '../models/User.js';
// Email notifications are handled by the digest scheduler now

export async function createClaim(req, res, next) {
  try {
    configureCloudinary();
    const { postId } = req.params;
    const { message, requesterId } = req.body; // requesterId would come from auth in real app
    const post = await Post.findById(postId);
    if (!post) return res.status(httpStatus.NOT_FOUND).json({ error: 'Post not found' });
    if (String(post.ownerId) === String(requesterId)) {
      return res.status(httpStatus.BAD_REQUEST).json({ error: 'Owners cannot claim their own post' });
    }
    
    // Different claim logic based on post type
    if (post.type === 'FOUND') {
      // For FOUND posts: only one claim per user per post (owner can only claim once)
      const existing = await Claim.findOne({ postId: post._id, requesterId });
      if (existing) return res.status(httpStatus.BAD_REQUEST).json({ error: 'You have already submitted a claim for this post' });
    } else if (post.type === 'LOST') {
      // For LOST posts: allow unlimited claims per user (multiple people can claim to have found the item)
      // No restriction on number of claims per user
    }
    const evidence = [];
    for (const f of (req.files || [])) {
      const result = await uploadBufferToCloudinary(f.buffer, f.originalname, `findmystuff/claims`);
      evidence.push({ type: 'PHOTO', url: result.secure_url });
    }
    const claim = await Claim.create({ postId: post._id, requesterId, message, evidence });
    return res.status(httpStatus.CREATED).json(claim);
  } catch (err) { next(err); }
}

export async function listClaims(req, res, next) {
  try {
    const { postId, requesterId, status } = req.query;
    const q = {};
    if (postId) q.postId = postId;
    if (requesterId) q.requesterId = requesterId;
    if (status) q.status = status;
    const claims = await Claim.find(q).sort({ createdAt: -1 });
    return res.json(claims);
  } catch (err) { next(err); }
}

export async function getClaimById(req, res, next) {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(httpStatus.NOT_FOUND).json({ error: 'Claim not found' });
    return res.json(claim);
  } catch (err) { next(err); }
}

export async function updateClaim(req, res, next) {
  try {
    const { status, flagFalseClaim } = req.body; // ACCEPTED, REJECTED, WITHDRAWN; flagFalseClaim increments requester flags
    const update = { status };
    if (flagFalseClaim === true) update.flaggedFalse = true;
    const claim = await Claim.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!claim) return res.status(httpStatus.NOT_FOUND).json({ error: 'Claim not found' });
    // Owner decision for LOST; Admin decision path would be separate endpoint.
    if (status === 'ACCEPTED') {
      await Post.findByIdAndUpdate(claim.postId, { status: 'RESOLVED', claimId: claim._id });
    }
    if (flagFalseClaim === true) {
      // Increase flags count for requester; if >=2, mark for admin review
      const requester = await User.findById(claim.requesterId);
      if (requester) {
        requester.flagsCount = (requester.flagsCount || 0) + 1;
        if (requester.flagsCount >= 2) requester.flaggedForReview = true;
        await requester.save();
      }
    }
    return res.json(claim);
  } catch (err) { next(err); }
}

export async function getClaimContact(req, res, next) {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(httpStatus.NOT_FOUND).json({ error: 'Claim not found' });
    const post = await Post.findById(claim.postId);
    if (!post) return res.status(httpStatus.NOT_FOUND).json({ error: 'Post not found' });
    const isAccepted = claim.status === 'ACCEPTED' && (post.type === 'LOST' || (post.type === 'FOUND' && claim.adminDecision === 'APPROVED'));
    if (!isAccepted) return res.status(httpStatus.FORBIDDEN).json({ error: 'Contact not available' });

    const owner = await User.findById(post.ownerId);
    const requester = await User.findById(claim.requesterId);

    const ownerShareEmail = owner?.profile?.contactPrefs?.shareEmailOnAcceptedClaim;
    const ownerSharePhone = owner?.profile?.contactPrefs?.sharePhoneOnAcceptedClaim;
    const reqShareEmail = requester?.profile?.contactPrefs?.shareEmailOnAcceptedClaim;
    const reqSharePhone = requester?.profile?.contactPrefs?.sharePhoneOnAcceptedClaim;

    const ownerContact = {
      email: ownerShareEmail ? owner.email : undefined,
      phone: ownerSharePhone ? owner.profile?.phone : undefined
    };
    const requesterContact = {
      email: reqShareEmail ? requester.email : undefined,
      phone: reqSharePhone ? requester.profile?.phone : undefined
    };

    return res.json({ ownerContact, requesterContact });
  } catch (err) { next(err); }
}


