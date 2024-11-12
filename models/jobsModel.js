import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    company:{
        type: String,
        required: [true,'Company name require']
    },
    position:{
       type: String,
       required: [true, 'Job Position is required'],
       maxlength: 100
    },
    status:{
        type: String,
        enum: ['pending','reject','interview'],
        default: 'pending'
    },
    workType:{
         type: String,
         enum: ['full-time','part-time','internship','contract'],
         default: 'full-time'
    },
    workLocation:{
        type: String,
        default:"Noida",
        required:[true, 'Work-Location require']
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref:'User'
    }
},{timestamps : true})
export default mongoose.model("Job",jobSchema);