import { Types } from 'mongoose';
import { Lead } from '../models/Lead.model';
import { LeadStatus } from '../types';
import type { ILeadDocument } from '../types';

interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sort?: 'latest' | 'oldest';
}

interface PaginatedResult {
  leads: ILeadDocument[];
  total: number;
  page: number;
  pages: number;
}

type CreateLeadData = Pick<ILeadDocument, 'name' | 'email' | 'source'> & {
  status?: LeadStatus;
};

type UpdateLeadData = Partial<Pick<ILeadDocument, 'name' | 'email' | 'source' | 'status'>>;

export const getLeads = async (
  filters: LeadFilters,
  pagination: PaginationOptions,
  userId: string,
  role: string,
): Promise<PaginatedResult> => {
  const query: Record<string, unknown> = {};

  if (role === 'sales_user') {
    query.createdBy = new Types.ObjectId(userId);
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.search) {
    const regex = { $regex: filters.search, $options: 'i' };
    query.$or = [
      { name: regex },
      { email: regex },
    ];
  }

  const sortOrder = pagination.sort === 'oldest' ? 1 : -1;
  const skip = (pagination.page - 1) * pagination.limit;

  const [leads, total] = await Promise.all([
    Lead.find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(pagination.limit)
      .exec(),
    Lead.countDocuments(query).exec(),
  ]);

  return {
    leads,
    total,
    page: pagination.page,
    pages: Math.ceil(total / pagination.limit),
  };
};

export const createLead = async (
  data: CreateLeadData,
  userId: string,
): Promise<ILeadDocument> => {
  const lead = await Lead.create({
    ...data,
    createdBy: new Types.ObjectId(userId),
  });

  return lead;
};

export const updateLead = async (
  id: string,
  data: UpdateLeadData,
  userId: string,
  role: string,
): Promise<ILeadDocument> => {
  const lead = await Lead.findById(id);

  if (!lead) {
    throw Object.assign(new Error('Lead not found'), { statusCode: 404 });
  }

  if (role !== 'admin' && lead.createdBy.toString() !== userId) {
    throw Object.assign(new Error('Forbidden: you can only update your own leads'), { statusCode: 403 });
  }

  Object.assign(lead, data);
  await lead.save();

  return lead;
};

export const deleteLead = async (
  id: string,
  _userId: string,
  role: string,
): Promise<void> => {
  void _userId;
  const lead = await Lead.findById(id);

  if (!lead) {
    throw Object.assign(new Error('Lead not found'), { statusCode: 404 });
  }

  if (role !== 'admin') {
    throw Object.assign(new Error('Forbidden: only admins can delete leads'), { statusCode: 403 });
  }

  await Lead.findByIdAndDelete(id);
};

export const exportLeads = async (
  filters: LeadFilters,
  userId: string,
  role: string,
): Promise<string> => {
  const query: Record<string, unknown> = {};

  if (role === 'sales_user') {
    query.createdBy = new Types.ObjectId(userId);
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.source) {
    query.source = filters.source;
  }

  if (filters.search) {
    const regex = { $regex: filters.search, $options: 'i' };
    query.$or = [
      { name: regex },
      { email: regex },
    ];
  }

  const leads = await Lead.find(query).sort({ createdAt: -1 }).exec();

  const escape = (val: string): string => {
    if (val.includes(',') || val.includes('"') || val.includes('\n')) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((lead) => [
    escape(lead.name),
    escape(lead.email),
    lead.status,
    lead.source,
    lead.createdAt.toISOString(),
  ].join(','));

  return [headers.join(','), ...rows].join('\n');
};
