import jobsModel from '../models/jobsModel.js'
import mongoose from 'mongoose';
import moment from 'moment';
//CREATE JOBS
export const createJobcontroller = async(req,res,next)=>{
    const{company, position} = req.body;
    if(!company || !position){
        next("please filled require field")
    }
    req.body.createdBy = req.user.userId;
    const job = await jobsModel.create(req.body);
    res.status(201).json({job});
} 
//GET JOBS
export const getJobcontroller = async(req,res,next)=>{
    const {status, workType, search, sort} = req.query;
    //condition for searching filters
    const queryobj = {
        createdBy: req.user.userId,
    }
    //logic filters
    if(status && status !== 'all'){
        queryobj.status = status;
    }
    if(workType && workType !== 'all'){
        queryobj.workType = workType;
    }
    if(search){
        //regex - search capabilities for self-managed
        queryobj.position = {$regex: search , $options :"i"};
    }
    let queryresult = jobsModel.find(queryobj);
    if(sort === "latest"){
        queryresult = queryresult.sort("-createdAt");
    }
    if(sort === "oldest"){
        queryresult = queryresult.sort("createdAt");
    }
    if(sort === "a-z"){
        queryresult = queryresult.sort("position");
    }
    if(sort === "z-a"){
        queryresult = queryresult.sort("-position");
    }
    //pagination
    //mongosse provide this ele page,limit,skip
    //get page no.
    const page = Number(req.query.page) || 1;
    //per page document
    const limit = Number(req.query.limit) || 7;
    //hide previous value
    const skip = (page-1)*limit
    queryresult = queryresult.skip(skip).limit(limit);
    //jobs count
    const totalJobs = await jobsModel.countDocuments(queryresult);
    const numOfPage = Math.ceil(totalJobs/limit);
    const job = await queryresult;
    // const jobs = await jobsModel.find({createdBy: req.user.userId});
    res.status(200).json({
        totalJobs,
        job,
        numOfPage
    })
}
//security - cross scripting attack -express provide sematic library- helmet for security purpose
//update jobs
export const updateJobController = async(req,res,next)=>{
    //get mongoose id to update job
    const{id} = req.params
    const{company, position} = req.body;
    if(!company || !position){
        next("all fields require");
    }
    ///first find job then update job
    const job = await jobsModel.findOne({ _id: id});
    if(!job){
        next(`there is no job exist with this ${id}`);
    }
    if(!req.user.userId === job.createdBy.toString()){
        next('you are not authorize to update this job');
        return;
    }
    const updatejob = await jobsModel.findOneAndUpdate({ _id: id},req.body,{
        new: true,
        runValidators : true
    });
    res.status(200).json({ updatejob });
};
//DELETE JOB
export const deleteJobController = async(req,res,next)=>{
  //find id from parameter
   const{id} = req.params
   //find job
   const job = await jobsModel.findOne({_id : id});
   if(!job){
    next(`No job found with id ${id}`);
   }
   if(!req.user.userId === job.createdBy.toString()){
    next("you are not authorize to delete");
    return;
   }
   await job.deleteOne();
   res.status(200).json({message: "Job are deleted"});

}
// // --------JOBS STATS AND FILTER---
export const jobStatsController = async(req,res)=>{
      const stats = await jobsModel.aggregate([
        //search by user jobs //call aggregate function
        {
            $match :  {
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
            },
        },
        //new object - group - for filters
        {
            $group: {
                _id : "$status",
                count: {$sum : 1},
            }
        }
      ]);

       //default stats
       const defaultstats ={
         pending : stats.pending || 0,
         reject: stats.reject || 0,
         interview: stats.interview || 0
       }
        //monthly application filter
    
        let monthlyApplication = await jobsModel.aggregate([
            {
                $match :{
                    createdBy: new mongoose.Types.ObjectId(req.user.userId)
                }
            },
            {
                $group: {
                    _id:{
                        year:{$year : '$createdAt'},
                        month:{ $month: '$createdAt'}
                    },
                    count:{
                       $sum : 1,
                    }
                }
            },

        ]);
        //moment library is used for time and date
        monthlyApplication = monthlyApplication.map( item =>{
          const {_id:{year,month},count} = item
          const date = moment().month(month-1).year(year).format('MMM Y');
          return { date, count};
        }).reverse();
      res.status(200).json({ totalJobs: stats.length, stats, defaultstats, monthlyApplication});
};