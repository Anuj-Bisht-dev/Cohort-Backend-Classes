import cookieParser from "cookie-parser";
import express from "express";
import router from "./modules/auth/auth.route.js";
import { ApiError } from "./common/utils/api-error.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", router);

// Catch-all for undefined routes
app.all("{*path}", (req, res) => {
    throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

export default app;
