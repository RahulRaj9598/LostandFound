import mongoose from 'mongoose';
import { ProfileSchema } from './Profile.js';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  emailVerified: { type: Boolean, default: false },
  passwordHash: { type: String },
  role: { type: String, enum: ['USER','ADMIN'], default: 'USER' },
  status: { type: String, enum: ['PENDING_APPROVAL','ACTIVE','SUSPENDED','REJECTED'], default: 'PENDING_APPROVAL' },
  profile: { type: ProfileSchema, required: true },
  flagsCount: { type: Number, default: 0 },
  flaggedForReview: { type: Boolean, default: false },
  suspendedUntil: { type: Date },
  terminatedAt: { type: Date }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;


