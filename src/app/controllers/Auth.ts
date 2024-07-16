import { Request, Response } from "express";
import { VERIFICATION_TIMEOUT_DURATION } from "../../config/Constants";
import pool from "../../config/Database";
import { compareValue, hashValue } from "../../helpers/bcryptHelper";
import { mailOptions, transporter } from "../../helpers/mailer";
import { IEmailVerification, IJwtPayload } from "../../types/Auth";
import { IUser } from "../../types/User";
import {
  generateAccessToken,
  generatePasswordResetToken,
} from "../../utils/TokenGenerator";
import { verificationCodeGenerator } from "../../utils/verificationCodeGenerator";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "../../validators/authSchemas";
import * as queries from "../queries/Auth";

const userSignUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    await signUpSchema.validate({ username, email, password });

    const usernameExistence = await pool.query(
      queries.CHECK_USERNAME_EXISTENCE,
      [username]
    );
    if (usernameExistence.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "Username already exists" });
    }

    const emailExistence = await pool.query(queries.CHECK_EMAIL_EXISTENCE, [
      email,
    ]);
    if (emailExistence.rows.length > 0) {
      return res
        .status(400)
        .json({ success: false, error: "Email already exists" });
    }

    const hashedPassword = await hashValue(password);
    await pool.query(queries.USER_SIGN_UP, [
      username,
      email,
      hashedPassword,
    ]);

    res.status(200).json({
      success: true,
      message: "User signed up successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      errorMessage: "Something went wrong. Please try again later.",
    });
  }
};

const userSignIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    await signInSchema.validate({ email, password });

    const result = await pool.query(queries.USER_SIGN_IN, [email]);
    const user: IUser = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        errorMessage: "User does not exist",
        authentication: false,
      });
    }

    const isPasswordValid = await compareValue(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        errorMessage: "Invalid password",
        authentication: false,
      });
    }

    const accessTokenPayload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(accessTokenPayload);

    res.status(200).json({
      success: true,
      data: {
        message: "Logged in successfully",
        user: user,
        token: accessToken,
      },
      authentication: true,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      errorMessage: "Something went wrong. Please try again later.",
      authentication: false,
    });
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    await forgotPasswordSchema.validate({ email });

    const userExistenceResult = await pool.query(
      queries.CHECK_EMAIL_EXISTENCE,
      [email]
    );
    const user: IUser = userExistenceResult.rows[0];

    if (userExistenceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User Not Found",
        errorMessage: "User does not exist",
      });
    }

    const passwordResetTokenPayload: IJwtPayload = {
      email: user.email,
    };

    const passwordResetToken = generatePasswordResetToken(
      passwordResetTokenPayload
    );

    const verificationCode = verificationCodeGenerator();

    try {
      await transporter.sendMail(mailOptions({ email, verificationCode }));
    } catch (error: any) {
      console.error("Error sending email: ", error.message);
      return res.status(500).json({
        success: false,
        error: "Email Sending Error",
        errorMessage: "Failed to send verification email.",
      });
    }

    const hashedCode = await hashValue(verificationCode);

    const resetEmailExistenceResult = await pool.query(
      queries.CHECK_RESET_EMAIL_EXISTENCE,
      [email]
    );
    if (resetEmailExistenceResult.rows.length === 0) {
      await pool.query(queries.ADD_VERIFICATION_CODE, [hashedCode, email]);
    } else {
      await pool.query(queries.UPDATE_VERIFICATION_CODE, [hashedCode, email]);
    }

    setTimeout(async () => {
      try {
        await pool.query(queries.DELETE_VERIFICATION_CODE, [user.email]);
        console.log(
          `Verification code for ${user.email} deleted after 30 minutes`
        );
      } catch (deleteError) {
        console.error(
          `Failed to delete verification code for ${user.email}: `,
          deleteError
        );
      }
    }, VERIFICATION_TIMEOUT_DURATION);

    res.status(200).json({
      success: true,
      data: {
        message: "Verification email sent successfully",
        token: passwordResetToken,
      },
      authentication: true,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      errorMessage: "Something went wrong. Please try again later.",
    });
  }
};

const emailVerification = async (req: Request, res: Response) => {
  try {
    const { verificationCode } = req.body;
    const user = res.locals.user;

    const verifyEmailExistenceResult = await pool.query(
      queries.CHECK_RESET_EMAIL_EXISTENCE,
      [user.email]
    );
    const emailVerification: IEmailVerification =
      verifyEmailExistenceResult.rows[0];

    if (verifyEmailExistenceResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        errorMessage: "Verification code expired, resend code again",
        authentication: false,
      });
    }

    const isCodeValid = await compareValue(
      verificationCode,
      emailVerification.code
    );
    if (!isCodeValid) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        errorMessage: "Invalid code",
        authentication: false,
      });
    }

    res.status(200).json({
      success: true,
      data: { message: "Email verification successful" },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      errorMessage: "Something went wrong. Please try again later.",
      authentication: false,
    });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  try {
    const { password, confirmPassword } = req.body;
    const user = res.locals.user;

    await resetPasswordSchema.validate({ password, confirmPassword });

    const hashedPassword = await hashValue(confirmPassword);

    await pool.query(queries.UPDATE_PASSWORD, [hashedPassword, user.email]);

    await pool.query(queries.DELETE_VERIFICATION_CODE, [user.email]);

    res.status(200).json({
      success: true,
      data: { message: "Password reset successfully" },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      errorMessage: "Something went wrong. Please try again later.",
    });
  }
};

const resendVerificationCode = async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;
    const email = user.email;

    const verificationCode = verificationCodeGenerator();

    try {
      await transporter.sendMail(mailOptions({ email, verificationCode }));
    } catch (error: any) {
      console.error("Error sending email: ", error.message);
      return res.status(500).json({
        success: false,
        error: "Email Sending Error",
        errorMessage: "Failed to send verification email.",
      });
    }

    const hashedCode = await hashValue(verificationCode);

    const resetEmailExistenceResult = await pool.query(
      queries.CHECK_RESET_EMAIL_EXISTENCE,
      [email]
    );
    if (resetEmailExistenceResult.rows.length === 0) {
      await pool.query(queries.ADD_VERIFICATION_CODE, [hashedCode, email]);
    } else {
      await pool.query(queries.UPDATE_VERIFICATION_CODE, [hashedCode, email]);
    }

    setTimeout(async () => {
      try {
        await pool.query(queries.DELETE_VERIFICATION_CODE, [user.email]);
        console.log(
          `Verification code for ${user.email} deleted after 30 minutes`
        );
      } catch (deleteError) {
        console.error(
          `Failed to delete verification code for ${user.email}: `,
          deleteError
        );
      }
    }, VERIFICATION_TIMEOUT_DURATION);

    res.status(200).json({
      success: true,
      data: {
        message: "Verification email sent successfully",
      },
      authentication: true,
    });
  } catch (error: any) {
    console.error("Internal Server Error: ", error.message);

    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      errorMessage: "Something went wrong. Please try again later.",
    });
  }
};

export {
  emailVerification,
  forgotPassword,
  resendVerificationCode,
  resetPassword,
  userSignIn,
  userSignUp,
};
