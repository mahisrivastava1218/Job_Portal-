import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from 'jsonwebtoken';
//schema
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: ['true','Name is required']
    },
    lastName:{
        type: String,
    },
    email:{
        type: String,
        required:[true,'Email is required'],
        unique: true,
        validate: validator.isEmail,
    },
    password:{
        type: String,
        required: [true, "password is require"],
        minlength :[7,"password should be more than 7"],
        select: true,
    },
    location:{
        type: String,
        default: "India",
    },
},
 {timestamps: true}
);
//middleware //Hashing Password //presave //not user csllback fucntion here not work //normal function
userSchema.pre('save',async function(){
    if(!this.isModified) return; //if not modified save data
    const salt = await bcrypt.genSalt(10) //create routes
   this.password = await bcrypt.hash(this.password, salt);
})
//compare password
userSchema.methods.comparePassword = async function(userPassword){
    const isMatch = await bcrypt.compare(userPassword,this.password);
    return isMatch;
}
//json webtoken //mongoose provide methods //arrow function not work //normal function 
userSchema.methods.createJWT = function(){
    //create token //mongoose bydefault id = this._id //token valid for 1day(example it store data 1d again login)
    return JWT.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn :'1d'});
};
export default mongoose.model('User',userSchema);