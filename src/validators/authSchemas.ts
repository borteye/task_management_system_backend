import * as yup from "yup";

const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signUpSchema = yup.object().shape({
  username: yup
    .string()
    .max(15, "Username is too long")
    .required("Username is required"),
  email: yup
    .string()
    .matches(emailRegex, "Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
});

export const signInSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, "Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .matches(emailRegex, "Enter a valid email")
    .required("Email is required"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});
