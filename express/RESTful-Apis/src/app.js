import cookieParser from "cookie-parser";
import express, { json } from "express";
import * as authRoute from "./modules/auth/auth.route.js"

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/get", authRoute);

export default app;
