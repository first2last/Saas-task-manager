import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  slug: string;
  name: string;
  plan: 'free' | 'pro';
  noteLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  },
  noteLimit: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);
