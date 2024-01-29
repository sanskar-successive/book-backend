
import express from 'express';
import UserController from './user.controller';
const router = express.Router();

const userController = new UserController();

router.post('/', userController.createNew);
router.get('/', userController.getAll);
router.get('/:userId', userController.getById);
router.patch('/:userId', userController.update);
router.delete('/:userId', userController.delete);
router.post('/login', userController.login);

export default router;