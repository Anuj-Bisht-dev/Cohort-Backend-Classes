import mongoose from "mongoose";

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGOOSE_URI);

    console.log(`connect to mongodb: ${conn.connection.host}`);
}

export default connectDB;
