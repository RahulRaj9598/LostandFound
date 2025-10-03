import { Router } from 'express';
import authRoutes from './v1/auth.routes.js';
import userRoutes from './v1/user.routes.js';
import postRoutes from './v1/post.routes.js';
import claimRoutes from './v1/claim.routes.js';
import adminRoutes from './v1/admin.routes.js';

const router = Router();

router.use('/v1/auth', authRoutes);
router.use('/v1/users', userRoutes);
router.use('/v1/posts', postRoutes);
router.use('/v1/claims', claimRoutes);
router.use('/v1/admin', adminRoutes);

export default router;


