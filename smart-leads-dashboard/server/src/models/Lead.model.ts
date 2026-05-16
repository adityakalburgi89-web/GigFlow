import { Schema, model } from 'mongoose';
import { LeadStatus, LeadSource } from '../types';
import type { ILeadDocument } from '../types';

const leadSchema = new Schema<ILeadDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.New,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

leadSchema.index({ status: 1, source: 1, createdAt: -1 });

export const Lead = model<ILeadDocument>('Lead', leadSchema);
