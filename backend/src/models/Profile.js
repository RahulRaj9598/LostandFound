import mongoose from 'mongoose';

const ContactPrefsSchema = new mongoose.Schema({
  shareEmailOnAcceptedClaim: { type: Boolean, default: true },
  sharePhoneOnAcceptedClaim: { type: Boolean, default: false },
  preferredContactMethod: { type: String, enum: ['EMAIL','PHONE','WHATSAPP'], default: 'EMAIL' }
}, { _id: false });

export const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  avatarUrl: { type: String },
  location: { type: { type: String, enum: ['Point'], default: 'Point' }, coordinates: { type: [Number], default: undefined } },
  contactPrefs: { type: ContactPrefsSchema, default: () => ({}) }
}, { _id: false });

