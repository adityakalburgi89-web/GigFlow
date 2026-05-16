import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import * as leadsService from '../services/leads.service';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 10));
    const sort = (req.query.sort as string) === 'oldest' ? 'oldest' : 'latest';

    const filters = {
      status: req.query.status as string | undefined,
      source: req.query.source as string | undefined,
      search: req.query.search as string | undefined,
    };

    const result = await leadsService.getLeads(
      filters,
      { page, limit, sort },
      req.user!.id,
      req.user!.role,
    );

    res.json({
      success: true,
      data: result.leads,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        pages: result.pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: 'Validation failed', data: errors.array() });
      return;
    }

    const lead = await leadsService.createLead(req.body, req.user!.id);

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, message: 'Validation failed', data: errors.array() });
      return;
    }

    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid lead ID format' });
      return;
    }

    const lead = await leadsService.updateLead(id, req.body, req.user!.id, req.user!.role);

    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: 'Invalid lead ID format' });
      return;
    }

    await leadsService.deleteLead(id, req.user!.id, req.user!.role);

    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    next(error);
  }
};

export const exportCSV = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = {
      status: req.query.status as string | undefined,
      source: req.query.source as string | undefined,
      search: req.query.search as string | undefined,
    };

    const csv = await leadsService.exportLeads(filters, req.user!.id, req.user!.role);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
};
