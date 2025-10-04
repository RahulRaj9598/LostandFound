import { Router } from 'express';
import * as AdminController from '../../controllers/admin.controller.js';
import { requireAuth, requireRole } from '../../middlewares/auth.js';

const router = Router();

router.get('/users', requireAuth, requireRole('ADMIN'), AdminController.listPendingUsers);
router.patch('/users/:id/approve', requireAuth, requireRole('ADMIN'), AdminController.approveUser);
router.patch('/users/:id/reject', requireAuth, requireRole('ADMIN'), AdminController.rejectUser);
router.post('/users/approve-without-email', requireAuth, requireRole('ADMIN'), AdminController.approveUsersWithoutEmailVerification);
router.get('/users/all', requireAuth, requireRole('ADMIN'), AdminController.listUsers);
router.patch('/users/:id/moderate', requireAuth, requireRole('ADMIN'), AdminController.moderateUser);

router.get('/claims', requireAuth, requireRole('ADMIN'), AdminController.listPendingFoundClaims);
router.patch('/claims/:id/decision', requireAuth, requireRole('ADMIN'), AdminController.decideFoundClaim);

export default router;


