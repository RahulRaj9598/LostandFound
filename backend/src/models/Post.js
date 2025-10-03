import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  alt: { type: String }
}, { _id: false });

const CATEGORY_ENUM = [
  'Electronics',
  'Wallets',
  'Keys',
  'Bags',
  'Clothing',
  'Documents',
  'Jewelry',
  'Pets',
  'Accessories',
  'Others'
];

const PostSchema = new mongoose.Schema({
  type: { type: String, enum: ['LOST','FOUND'], required: true, index: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: CATEGORY_ENUM, index: true },
  tags: { type: [String], default: [] },
  images: { type: [ImageSchema], default: [] },
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], index: '2dsphere' } },
  locationName: { type: String },
  status: { type: String, enum: ['OPEN','CLAIMED','RESOLVED','ARCHIVED'], default: 'OPEN', index: true },
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim' }
}, { timestamps: true });

// Speed up ownerId + createdAt queries (rate-limit, recent lists)
PostSchema.index({ ownerId: 1, createdAt: -1 });

const Post = mongoose.model('Post', PostSchema);
export default Post;


