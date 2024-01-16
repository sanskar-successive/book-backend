
import express from 'express';
import UserController from './user.controller';
import dynamicValidationMiddleware from '../../lib/middlewares/dynamicValidation.middleware';
const router = express.Router();

const userController = new UserController();


router.use(dynamicValidationMiddleware);

router.post('/', userController.createNew);
router.get('/', userController.getAll);
router.get('/:userId', userController.getById);
router.patch('/:userId', userController.update);
router.delete('/:userId', userController.delete);
router.post('/login', userController.login);


export default router;