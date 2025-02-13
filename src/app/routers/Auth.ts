import express, { Router } from "express";
import * as controller from "../controllers/Auth";
import { authenticateAccessToken, authenticatePasswordResetToken } from "../../middlewares/JWTAuthenticator";

const router: Router = express.Router();

router.post("/signIn", controller.userSignIn);
router.post("/signUp", controller.userSignUp);
router.post("/forgot-password", controller.forgotPassword);
router.post(
  "/email-verification",
  authenticatePasswordResetToken,
  controller.emailVerification
);
router.post(
  "/resend-verification-code",
  authenticatePasswordResetToken,
  controller.resendVerificationCode
);
router.post(
  "/reset-password",
  authenticatePasswordResetToken,
  controller.resetPassword
);

router.get("/get-users",authenticateAccessToken, controller.getUsers);

export default router;
