//create server
//npm init //npm i express
//import
//remove commanjs - use module bases approach - import/export
import swaggerDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
// import xss from 'xss';
import mongosanitize from 'express-mongo-sanitize';
import'express-async-errors'; //automatically handle error replace try catch
import dotenv from 'dotenv';
import colors from 'colors';
import connectdb from './config/database.js';
import testRoutes from './routes/testRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middlewares/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import jobsRoutes from './routes/jobsRoutes.js';
import helmet from "helmet";

//DOT env config 
//call {path: './config'} 
//here we are giving direct path
dotenv.config();
//mongodb connection
connectdb();
//rest object

const options ={
    definition:{
        openapi: "3.0.0",
        info:{
            title: "try this job", 
            description: "application expressjs job-portal"
        },
        servers:[
            {
                url: "http://localhost:4000",
                url: "https://nodejs-job-portal-zjkt.onrender.com/"
            }
        ],
    },
    apis:["./routes/*.js"],
};
const spec = swaggerDoc(options);
const app = express();
//middleware - to tell we are dealing with json data
// app.use(xss);
app.use(helmet());
app.use(mongosanitize());
app.use(express.json());
app.use(cors());
// rate-limiting middleware for Express. Use to limit repeated requests 
// to public APIs and/or endpoints such as password reset. 

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(spec));

//it gives the path status
app.use(morgan("dev"));
//routes
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes );
app.use('/api/v1/job', jobsRoutes);
//validation middleware
app.use(errorMiddleware);
// CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
//get api postman
app.get('/',(req,res) => {
    res.send("<h2>this is job portal application</h2>")
});
//port
const PORT = process.env.PORT || 4000;
//listen
app.listen(PORT, ()=>{
    console.log(`node servers running on ${process.env.DEV_MODE} mode on port no ${PORT}`.bgBlack.blue);
})
//MVC ARCHITECTURE Nodejs - for fullstack application   
//mvc pattern(design pattern ) - model,view,controller 
//application divide in three part
//in model - schema, database come
//in view - come react,angular,template engine(frontend)
//in controller - apis,business logic, functionality
//folders below
//config - system related/database related configuration file
//models- design schemaa/no sql 
//view/public for frontend
//controllers - business logic
//routes - to making route
//middleware - check logic if logic is true then continue 
//utils - utility any functionality add
//test - normal testi 
//src- any src/public/views - optional
//assets - add any assets image/video
