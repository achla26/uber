import dotenv from "dotenv";
dotenv.config(); 
import  express  from "express"; 
import cors from "cors";
import connectDB from "./db/index.js";
const app = express();

connectDB();

app.use(cors());

app.get("/" , (req , res)=>{
    res.send("hello")
});

export default app;