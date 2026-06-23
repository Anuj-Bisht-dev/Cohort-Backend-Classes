import { Router } from "express";
import AuthenticationControllers from "./auth.controller";

const authenticationController = new AuthenticationControllers();
const authRouter = Router();

authRouter.post(
  "/sign-up",
  authenticationController.handleSignup.bind(authenticationController)
);

export default authRouter;
