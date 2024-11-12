import express from "express"
import { updateUserController } from "../controllers/userController.js";
import userAuth from "../middlewares/authmiddleware.js";

//user api
//router object
const router = express.Router()
//routes
//GET USERS || GET

//update user || PUT
router.put('/update-user', userAuth , updateUserController);


export default router;