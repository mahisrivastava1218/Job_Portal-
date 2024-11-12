import userModel from "../models/userModel.js";

export const registerController = async (req,res,next)=>{
//   try{
     const {name,email,password} = req.body;
    //  validate
    if(!name){
        // return res.status(400).send({success:false,message:'required name'});
        next("name is required");
    }
    if(!email){
        // return res.status(400).send({success:false,message:'required email'});
        next("email is required");
    }
    if(!password){
        next("password is required & should be greater than 7");
    }
    //if user is lready exist
    //create one id from one mail
    const existingUser = await userModel.findOne({email});
    if(existingUser){
        // return res.status(200).send({
        //     success: false,
        //     message: 'Email Already register',
        //     minlength: [7,'Password should be more than 7']
        // })
        next('Email already register');
    }
    const user = await userModel.create({name,email,password});
    const token = user.createJWT();
    res.status(201).send({
        success: true,
        message: "user created successfully",
        user:{
           name: user.name,
           lastName:user.lastName,
           email:user.email,
           location: user.location
        },
        token,
    })
//   }catch(error){
    // console.log(error);
    // res.status(400).send({
    //     message:"Error registerController",
    //     success: false,
    //     error
    // })
//     next(error);
//   }
};
//async function mongodb database

export const loginController = async(req,res,next)=>{
 const {email,password} = req.body;
 //validation
 if(!email || !password){
    next("Please provide all fields")
 }
 const user = await userModel.findOne({email}).select("+password");
 if(!user || !password){
    //call next
    next("Invalid User not exist")
 }
 //compare password
 const isMatch = await user.comparePassword(password);
 if(!isMatch){
    return next("password invalid");
 }
 user.password = undefined;
 const token = user.createJWT();
 res.status(200).json({
    success: true,
    message: "Login Successfully",
    user,
    token,
 });
 //two step authentication
 
}