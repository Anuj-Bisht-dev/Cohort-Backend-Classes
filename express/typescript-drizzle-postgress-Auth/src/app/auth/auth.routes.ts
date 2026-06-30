import { Router } from "express";
import AuthenticationControllers from "./auth.controller";

const authenticationController = new AuthenticationControllers();
const authRouter = Router();

authRouter.post(
  "/sign-up",
  authenticationController.handleSignup.bind(authenticationController)
);

authRouter.post(
  "/sign-in",
  authenticationController.handelSignin.bind(authenticationController)
);

authRouter.post(
  "/sign-out",
  authenticationController.handleSignOut.bind(authenticationController)
);

authRouter.post(
  "/forgot-password",
  authenticationController.handleForgetPassword.bind(authenticationController)
);

authRouter.post(
  "/reset-password",
  authenticationController.handleResetPassword.bind(authenticationController)
);

export default authRouter;
