import { Router } from 'express';
import * as UserController from '../../controllers/user.controller.js';
import { requireAuth } from '../../middlewares/auth.js';
import { upload } from '../../services/upload.service.js';

const router = Router();

router.get('/me', requireAuth, UserController.getMe);
router.patch('/me', requireAuth, UserController.updateMe);
router.get('/:id', UserController.getPublicProfile);
router.post('/me/avatar', requireAuth, upload.single('avatar'), UserController.uploadAvatar);

export default router;


