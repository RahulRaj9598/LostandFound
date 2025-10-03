import mongoose from 'mongoose';

const EmailOTPSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  purpose: { type: String, enum: ['VERIFY','LOGIN'], required: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: true },
  attempts: { type: Number, default: 0 }
}, { timestamps: true });

const EmailOTP = mongoose.model('EmailOTP', EmailOTPSchema);
export default EmailOTP;


