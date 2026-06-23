import express from "express";
import type { Express } from "express";

export function createExpressApp(): Express {
  const app = express();

  // Middlewares

  // Routes
  app.get("/", (req, res) => {
    return res.json({
      message: "welcome to my postgress backend service",
    });
  });

  return app;
}
