import mongoose from 'mongoose';

const EvidenceSchema = new mongoose.Schema({
  type: { type: String, enum: ['PHOTO','TEXT','DOC'], default: 'PHOTO' },
  url: { type: String },
  text: { type: String }
}, { _id: false });

const ClaimSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  message: { type: String },
  evidence: { type: [EvidenceSchema], default: [] },
  status: { type: String, enum: ['PENDING','ACCEPTED','REJECTED','WITHDRAWN'], default: 'PENDING', index: true },
  revealedAt: { type: Date },
  adminDecision: { type: String, enum: ['APPROVED','DENIED', null], default: null },
  flaggedFalse: { type: Boolean, default: false },
  digestNotified: { type: Boolean, default: false }
}, { timestamps: true });

const Claim = mongoose.model('Claim', ClaimSchema);
export default Claim;


