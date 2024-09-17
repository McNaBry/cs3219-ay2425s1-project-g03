import { Router } from 'express';
import { createHistory, findHistoryByUser } from '../controllers/historyController';
const router = Router();

router.post('/history', createHistory);
router.get('/history/:userId', findHistoryByUser);

export default router;
