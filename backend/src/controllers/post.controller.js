import httpStatus from 'http-status';
import Post from '../models/Post.js';
import { configureCloudinary, uploadBufferToCloudinary } from '../services/upload.service.js';

export async function createPost(req, res, next) {
  try {
    configureCloudinary();
    const { type, title, description, category, tags, lat, lng, locationName } = req.body;
    // Use authenticated user id from token
    const ownerId = req.user?.sub;
    if (!ownerId) return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' });
    // Rate-limit: max 3 new posts per 30 minutes per owner
    if (ownerId) {
      const windowMs = 30 * 60 * 1000;
      const cutoff = new Date(Date.now() - windowMs);
      const recentCount = await Post.countDocuments({ ownerId, createdAt: { $gte: cutoff } });
      if (recentCount >= 3) {
        // find oldest post inside window to compute remaining wait
        const oldest = await Post.findOne({ ownerId, createdAt: { $gte: cutoff } }).select('createdAt').sort({ createdAt: 1 });
        const msLeft = windowMs - (Date.now() - new Date(oldest.createdAt).getTime());
        const mins = Math.max(1, Math.ceil(msLeft / 60000));
        return res.status(429).json({ error: `Rate limit: up to 3 posts every 30 minutes. Try again in about ${mins} minute(s).` });
      }
    }
    const images = [];
    for (const f of (req.files || [])) {
      const result = await uploadBufferToCloudinary(f.buffer, f.originalname, `findmystuff/posts`);
      images.push({ url: result.secure_url, alt: f.originalname });
    }
    const location = (lat !== undefined && lng !== undefined) ? { type: 'Point', coordinates: [Number(lng), Number(lat)] } : undefined;
    const post = await Post.create({ type, ownerId, title, description, category, tags, images, ...(location ? { location } : {}), ...(locationName ? { locationName } : {}) });
    return res.status(httpStatus.CREATED).json(post);
  } catch (err) { next(err); }
}

export async function listPosts(req, res, next) {
  try {
    const { type, status, category, ownerId, location } = req.query;
    const q = {};
    if (type) q.type = type;
    if (status) q.status = status;
    if (category) q.category = category;
    if (ownerId) q.ownerId = ownerId;
    if (location) q.locationName = { $regex: String(location), $options: 'i' };
    const posts = await Post.find(q).sort({ createdAt: -1 }).limit(100).populate('ownerId', 'profile.name email');
    const categories = Post.schema.path('category').enumValues || [];
    return res.json(posts);
  } catch (err) { next(err); }
}

export async function getPostById(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).populate('ownerId', 'profile.name email');
    if (!post) return res.status(httpStatus.NOT_FOUND).json({ error: 'Post not found' });
    return res.json(post);
  } catch (err) { next(err); }
}

export async function updatePost(req, res, next) {
  try {
    const update = { ...req.body };
    if (update.lat !== undefined && update.lng !== undefined) {
      update.location = { type: 'Point', coordinates: [Number(update.lng), Number(update.lat)] };
      delete update.lat;
      delete update.lng;
    }
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(httpStatus.NOT_FOUND).json({ error: 'Post not found' });
    return res.json(post);
  } catch (err) { next(err); }
}

export async function deletePost(req, res, next) {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(httpStatus.NOT_FOUND).json({ error: 'Post not found' });
    return res.status(httpStatus.NO_CONTENT).send();
  } catch (err) { next(err); }
}


