import { Router } from 'express';
import * as PostController from '../../controllers/post.controller.js';
import { upload } from '../../services/upload.service.js';
import { requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.post('/', requireAuth, upload.array('images', 5), PostController.createPost);
router.get('/', PostController.listPosts);
router.get('/:id', PostController.getPostById);
router.patch('/:id', PostController.updatePost);
router.delete('/:id', PostController.deletePost);

export default router;


