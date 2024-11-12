//error middleware ||next function
// const errorMiddleware = (err,req,res,next)=>{
//     //next for execution
//     console.log(err);
//     res.status(500).send({
//         success: false,
//         message: "something went wrong",
//         err,
//     });
// };
// export default errorMiddleware;

const errorMiddleware = (err,req,res,next)=>{
    //next for execution
    console.log(err);
    const defaultErrors = {
        statusCode: 500,
        message: err,
    };
    //missing filed error
    if(err.name === "ValidationError"){
        defaultErrors.statusCode = 400;
        defaultErrors.message = Object.values(err.errors).map((item)=> item.message).join(",");
    }
    //duplicate error - mail
    if(err.code && err.code === 11000){
        defaultErrors.statusCode = 400;
        defaultErrors.message = `${Object.keys(err.keyValue)} field shoud be unique`;
    }
    res.status(defaultErrors.statusCode).json({message: defaultErrors.message});
};
export default errorMiddleware;