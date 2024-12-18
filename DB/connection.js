import mongoose from 'mongoose';

export const connectDB=async()=>{
    return await mongoose
    .connect(process.env.CONNECTION_URL)
    .then(()=>console.log("Db connected successfully!"))
    .catch((error)=>console.log("Error connecting to mongoose",error));
};