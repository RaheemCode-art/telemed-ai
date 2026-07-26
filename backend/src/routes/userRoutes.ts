import express from 'express';
import { getUsers } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.route('/').get(getUsers);

export default router;