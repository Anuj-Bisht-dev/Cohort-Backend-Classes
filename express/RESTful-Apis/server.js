import "dotenv/config"
import app from "./src/app.js"
import { connectDB } from "./src/common/config/db.js";

const PORT = process.env.PORT || 4000;

const main = async () => {
    // connect to db
    await connectDB();

    app.listen(PORT, () => {
        console.log(`server is running on ${PORT} in ${process.env.NODE_ENV} mode`);
    })
}

main().catch((error) => {
    console.log(`Failed to start the server: ${error}`);
    process.exit(1);
})
