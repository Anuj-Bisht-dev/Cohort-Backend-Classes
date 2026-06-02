import expess, { Router } from "express";
import AuthencationController from "./controller";

export const authRouter: Router = expess.Router();

const authencationController = new AuthencationController();

authRouter.post(
  "/sign-up",
  authencationController.handleSignup.bind(authencationController)
); // the authencationController is deteched. you are lossing an ref. so, uses bind to attached again
