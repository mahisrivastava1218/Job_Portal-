import mongoose from "mongoose";
import colors from 'colors';
const connectdb = async () =>{
    //response and error handling case
    try{
    const connect = await mongoose.connect(process.env.MONGODB_URL);
    console.log(
        `Node connected to Mongodb Database ${mongoose.connection.host}`.bgGreen.red
    )
    }catch(error){
        console.log(`MongoDb error ${error}`.bgMagenta.red);
    }
}
export default connectdb;