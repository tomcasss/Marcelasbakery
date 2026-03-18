import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
}, { timestamps: true });

export const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);
