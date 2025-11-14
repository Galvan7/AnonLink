import { log } from "console";
import mongoose, { ConnectOptions } from "mongoose";

type ConnectionObject = {
    isConnected?: number

}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connection to db");
        return
    }
    try {
        console.log("Connecting to MongoDB with URI:", process.env.MONGODBURI);
        const db = await mongoose.connect(process.env.MONGODBURI || "", {})
        connection.isConnected = db.connections[0].readyState
        console.log("Db connected successfully");
    }
    catch (error) {
        console.log("Database connection failed:", error);
        process.exit();
    }

}
// const dbConnect = async (): Promise<void> => {
//   if (connection.isConnected) {
//     console.log("Already connected to the database");
//     return;
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
//     connection.isConnected = db.connections[0].readyState;
//     console.log("Database connected successfully");
//   } catch (error) {
//     console.error("Database connection failed", error);
//     process.exit(1);
//   }
// };
export default dbConnect;