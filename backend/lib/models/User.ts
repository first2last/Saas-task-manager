import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  tenantId: mongoose.Types.ObjectId;
  email: string;
  password: string;
  role: 'admin' | 'member';
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member'
  }
}, {
  timestamps: true
});

// Compound index for tenant isolation
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', userSchema);
