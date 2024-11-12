import express from 'express';
import { testPostcontroller } from '../controllers/testController.js';
import userAuth from '../middlewares/authMiddleware.js';


//router objects
const router = express.Router();

//routes//product routes
router.post('/test-post', userAuth ,testPostcontroller);
// router.post("/") 
//export
export default router;