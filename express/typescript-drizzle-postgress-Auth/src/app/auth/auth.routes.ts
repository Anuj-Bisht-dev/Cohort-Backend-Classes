import { Router } from "express";
import AuthenticationControllers from "./auth.controller";
import { restrictToAuthenticatedUser } from "../../common/middleware/auth.middleware";

const authenticationController = new AuthenticationControllers();
const authRouter = Router();

authRouter.post(
  "/sign-up",
  authenticationController.handleSignup.bind(authenticationController)
);

authRouter.post(
  "/verify-email",
  authenticationController.handleVerifyEmail.bind(authenticationController)
);

authRouter.post(
  "/sign-in",
  authenticationController.handelSignin.bind(authenticationController)
);

authRouter.post(
  "/sign-out",
  restrictToAuthenticatedUser(),
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
