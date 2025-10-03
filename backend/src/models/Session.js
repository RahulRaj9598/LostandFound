import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  refreshTokenHash: { type: String, required: true },
  userAgent: { type: String },
  ip: { type: String },
  revokedAt: { type: Date },
  // TTL field: when this time passes, Mongo will auto-delete the session
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

// TTL index for sessions. Documents expire at "expiresAt"
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', SessionSchema);
export default Session;


