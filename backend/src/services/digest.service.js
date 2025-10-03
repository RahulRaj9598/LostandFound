import Claim from '../models/Claim.js';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { sendEmail } from './email.service.js';
import logger from '../config/logger.js';

let intervalHandle;

export function startClaimDigestScheduler() {
  const intervalMs = Number(process.env.CLAIM_DIGEST_INTERVAL_MS || 10 * 60 * 1000);
  if (intervalHandle) return;
  intervalHandle = setInterval(runOnce, intervalMs);
  // also run shortly after boot
  setTimeout(runOnce, 5000);
  logger.info({ intervalMs }, 'Claim digest scheduler started');
}

async function runOnce() {
  try {
    const since = new Date(Date.now() - Number(process.env.CLAIM_DIGEST_INTERVAL_MS || 10 * 60 * 1000));
    // Find claims created in the last window that haven't been notified yet
    const recentClaims = await Claim.find({ createdAt: { $gte: since }, digestNotified: { $ne: true } }).lean();
    if (recentClaims.length === 0) return;
    // Group by owner (post.ownerId)
    const postIds = [...new Set(recentClaims.map(c => String(c.postId)))];
    const posts = await Post.find({ _id: { $in: postIds } }).select('_id ownerId title').lean();
    const postMap = new Map(posts.map(p => [String(p._id), p]));
    const ownerToClaims = new Map();
    for (const claim of recentClaims) {
      const post = postMap.get(String(claim.postId));
      if (!post) continue;
      const ownerId = String(post.ownerId);
      if (!ownerToClaims.has(ownerId)) ownerToClaims.set(ownerId, []);
      ownerToClaims.get(ownerId).push({ claim, post });
    }
    // Send one email per owner
    const ownerIds = [...ownerToClaims.keys()];
    const owners = await User.find({ _id: { $in: ownerIds } }).select('_id email').lean();
    const ownerMap = new Map(owners.map(o => [String(o._id), o]));
    for (const ownerId of ownerIds) {
      const owner = ownerMap.get(ownerId);
      if (!owner?.email) continue;
      const items = ownerToClaims.get(ownerId) || [];
      const htmlItems = items.map(({ claim, post }) => {
        const firstImg = (claim.evidence || [])[0]?.url;
        return `
          <li style="margin-bottom:12px;">
            <div><strong>Post:</strong> ${escapeHtml(post.title || String(post._id))}</div>
            <div><strong>Message:</strong> ${escapeHtml(claim.message || '')}</div>
            ${firstImg ? `<div><img src="${firstImg}" alt="evidence" style="max-width:360px;border-radius:8px;margin-top:6px;"/></div>` : ''}
          </li>
        `;
      }).join('');
      const html = `
        <h2>You have ${items.length} new claim(s) in the last digest window</h2>
        <ul style="padding-left:16px;">${htmlItems}</ul>
        <p><a href="${process.env.APP_BASE_URL || 'http://localhost:5173'}/posts/mine">Open My Posts</a></p>
      `;
      try {
        await sendEmail({ to: owner.email, subject: 'Claim digest', html, text: `${items.length} new claims` });
        // mark notified
        const claimIds = items.map(({ claim }) => claim._id);
        await Claim.updateMany({ _id: { $in: claimIds } }, { $set: { digestNotified: true } });
      } catch (err) {
        logger.error({ err }, 'Failed to send claim digest');
      }
    }
  } catch (err) {
    logger.error({ err }, 'Claim digest run failed');
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[s]));
}


