import express from 'express';
import bookRoutes from './modules/book/book.routes'
import userRoutes from './modules/user/user.routes'

const router = express.Router();

router.use('/api', bookRoutes)
router.use('/users', userRoutes);


export default router;
