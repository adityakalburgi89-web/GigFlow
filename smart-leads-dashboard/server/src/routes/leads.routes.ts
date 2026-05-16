import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { createLeadValidator, updateLeadValidator } from '../validators/leads.validators';
import * as leadsController from '../controllers/leads.controller';

const router = Router();

router.get('/leads/export', authenticate, requireRole('admin'), leadsController.exportCSV);
router.get('/leads', authenticate, leadsController.list);
router.post('/leads', authenticate, createLeadValidator, leadsController.create);
router.put('/leads/:id', authenticate, updateLeadValidator, leadsController.update);
router.delete('/leads/:id', authenticate, requireRole('admin'), leadsController.remove);

export default router;
