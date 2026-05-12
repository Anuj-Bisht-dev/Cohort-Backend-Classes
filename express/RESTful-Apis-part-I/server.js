import "dotenv/config";
import { app } from "./src/app.js";
import { connectDB } from "./src/common/config/db.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    // db call connection

    app.listen(PORT, () => {
        console.log(`Server is running on ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
    });
}

start().catch((error) => {
    console.log('failed to start server', error);
    process.exit(1);
})
