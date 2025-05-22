import { Router } from 'express';
import { getStats } from '../controllers/statsController.ts';

const router = Router();

router.get('/v1/stats', getStats);

export default router;