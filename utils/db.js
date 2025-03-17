import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

const db = () => {
    mongoose.connect(process.env.MONGO_URL)
    .then(()=> {
        console.log("Connected to mongo db")
    })
    .catch((error) => {
        console.log("Error in connecting to mongo db")
    });
}

export default db;