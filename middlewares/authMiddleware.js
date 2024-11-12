import JWT from 'jsonwebtoken';

const userAuth = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        next("Auth Failed")
    }
    //get second value
    const token = authHeader.split(" ")[1];
    try{
        const payload = JWT.verify(token,process.env.JWT_SECRET);
        req.user = {userId : payload.userId};
        //if correct value get than further execute
        next();
    }catch(error){
        next("Auth failed");
    }
};
export default userAuth;


 