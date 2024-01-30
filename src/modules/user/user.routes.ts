
import express from 'express';
import UserController from './user.controller';
import dynamicValidationMiddleware from '../../lib/middlewares/dynamicValidation.middleware';
import authMiddleware from '../../lib/middlewares/auth.middleware';
const router = express.Router();

const userController = new UserController();


router.use(dynamicValidationMiddleware);

/**
 * @swagger
 * /users/login:
 *     post:
 *       tags:
 *         - "user login"
 *       summary: login user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
]*                   type: string
 *                   description: user email
 *                 password:
 *                   type: password
 *                   description: user password
 *       responses:
 *         '201':
 *           description: User created successfully
 *         '400':
 *           description: Bad Request
 *         '500':
 *           description: Internal Server Error`
 */

router.post('/login', userController.login);

/**
 * @swagger
 * /users:
 *     post:
 *       tags:
 *         - "Create user"
 *       summary: Create a new user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   description: user first name
 *                 lastName:
 *                   type: string
 *                   description: user last name
 *                 contact:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       description: user email
 *                     phone:
 *                       type: number
 *                       description: user phone number
 *                   description: Details about the user contact
 *                 password:
 *                   type: password
 *                   description: user password
 *                 confirmPassword:
 *                   type: password
 *                   description: confirm password
 *       responses:
 *         '201':
 *           description: User created successfully
 *         '400':
 *           description: Bad Request
 *         '500':
 *           description: Internal Server Error`
 */


router.post('/', userController.createNew);



// router.use(authMiddleware);

/**
 * @swagger
 * /users:
 *    get:
 *      tags:
 *        - get all users
 *      summary: Return all users
 *      responses:
 *        '200':
 *          description: list of users
 *        '404':
 *          description: Bad Request.
 *        '500':
 *          description: Internal server error.
 */
router.get('/', authMiddleware, userController.getAll);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     tags:
 *       - "Get user by id"
 *     summary: Returns a particular user.
 *     description: Returns a user matched to that id.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "659d9c8d0f8bc3a4280a74e5"
 *     responses:
 *       '200':
 *         description: User fetched successfully.
 *       '404':
 *         description: Bad Request.
 *       '500':
 *         description: Internal server error.
 */
router.get('/:userId', authMiddleware, userController.getById);



router.patch('/:userId',authMiddleware, userController.update);

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - "Delete user by id"
 *     summary: Delete user.
 *     description: Delete user matched to that id.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: Parameter description in CommonMark or HTML.
 *         schema:
 *           type: string
 *           example: "659d9c8d0f8bc3a4280a74e5"
 *     responses:
 *       '200':
 *         description: User deleted successfully.
 *       '404':
 *         description: Bad Request.
 *       '500':
 *         description: Internal server error.
 */
router.delete('/:userId', authMiddleware, userController.delete);



router.get('/account/home',authMiddleware, userController.getByEmail);


export default router;