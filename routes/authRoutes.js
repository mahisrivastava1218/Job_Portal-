import express from 'express';
import { registerController } from '../controllers/authController.js';
import { loginController } from '../controllers/authController.js';
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

//router object
const router = express.Router()

//routes

/**
 * @swagger 
 * components:
 *   schemas:
 *     User: 
 *      type: object
 *      required: 
 *         - name
 *         - email
 *         - password
 *         - location
 *      properties:
 *        id: 
 *          type: string
 *          description: The Auto generated id of a user collection	
 *          example: SVJKDNSKHGYTSH
 *        name:
 *          type: string
 *          description: User name
 *        lastname: 
 *          type: string
 *          description: Last Name
 *        email: 
 *          type: string
 *          description: User email address
 *        password: 
 *          type: string
 *          description: user password should be greater than 7
 *        location: 
 *          type: string
 *          description: User location city or country
 *      example:
 *        id: SVLBXJXVV
 *        name: mos
 *        lastName: sena
 *        email: mossena@gmail.com
 *        password: cvlkevjas
 *        location: cicago
 */

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: authentication apis here
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *  post:
 *   summary: signup new user
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content: 
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/User'
 *   responses:
 *    200:
 *     description: user login successfully
 *     content:
 *      application/json:
 *       schema: 
 *           $ref: '#/components/schemas/User'
 *    500:
 *       description: server error
 */
//create user
//Register || POST
router.post('/register',limiter, registerController);
//LOGIN || POST

/**
 * @swagger
 * /api/v1/auth/login:
 *  post:
 *   summary: User login
 *   tags: [Auth]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *        $ref: '#/components/schemas/User'
 *   responses:
 *    200:
 *       description: User login successfully
 *       content:
 *        application/json:
 *         schemas:
 *          $ref: '#/components/schemas/User'
 *    500:
 *     description: "server login error"
 */
router.post('/login',limiter ,loginController);
//export
export default router;