import express from 'express';
import userAuth from '../middlewares/authMiddleware.js';
import { createJobcontroller, deleteJobController, getJobcontroller, updateJobController, jobStatsController } from '../controllers/jobsController.js';

const router = express.Router();
//Create jobs ||post
router.post('/job-create',userAuth, createJobcontroller);
// GET JOBS ||
router.get('/Get-job',userAuth, getJobcontroller);

//update jobs ||put || patch
router.patch('/update-job/:id',userAuth, updateJobController);

//Delete jobs ||put
router.delete('/delete-job/:id',userAuth, deleteJobController);
//stats & filer || get jobs || Job stats filter
router.get("/jobs-stats",userAuth, jobStatsController);


export default router;
