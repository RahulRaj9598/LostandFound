import { Router } from 'express';
import * as ClaimController from '../../controllers/claim.controller.js';
import { upload } from '../../services/upload.service.js';

const router = Router();

router.get('/', ClaimController.listClaims);
router.post('/:postId', upload.array('evidence', 5), ClaimController.createClaim);
router.get('/:id', ClaimController.getClaimById);
router.patch('/:id', ClaimController.updateClaim);
router.get('/:id/contact', ClaimController.getClaimContact);

export default router;


