import express from "express";
import { authRouter } from "./auth/routes";

function createExpressApplication() {
  const app = express();

  // Middlewares
  app.use(express.json());

  // Routes
  app.get("/", (req, res) => {
    return res.json({
      message: "welcome to my auth service",
    });
  });

  app.get("/health", (req, res) => {
    return res.json({
      message: "health is upto date now",
    });
  });

  app.use("/auth", authRouter);

  return app;
}

export { createExpressApplication };
