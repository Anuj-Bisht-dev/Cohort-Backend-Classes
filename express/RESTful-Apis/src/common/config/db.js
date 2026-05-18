import mongoose from "mongoose";

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGOOSE_URI);
    // whats inside the conn
    console.log(`mongoDb connected: ${conn.connection.host}`);
}

export { connectDB }

// 2 imp. things while working with db
// first, db can be failed not always confirm to connect.
// second, db always in another continent
