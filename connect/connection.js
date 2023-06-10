require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log(err);
})