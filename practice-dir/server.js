import 'dotenv/config'
import app from './src/app.js'
import connectDB from './src/common/config/db.js';

const PORT = process.env.PORT || 5000;

async function main() {
    // connect to db
    await connectDB();

    app.listen(PORT, () => {
        console.log(`server is running on ${PORT} in ${process.env.NODE_ENV} enviornment`);
    })
}

main().catch((error) => {
    console.log(`server is failed to run: ${error}`);
    process.exit(1);
})
