require("dotenv").config();
import jwt, { Secret } from "jsonwebtoken";
import { IJwtPayload } from "../types/Auth";


export const generateAccessToken = (jwtPayload: IJwtPayload) => {
  return jwt.sign(jwtPayload,  process.env.ACCESS_TOKEN_SECRET_KEY as Secret, { expiresIn: "12h" });
};

export const generatePasswordResetToken = (jwtPayload: IJwtPayload) => {
  return jwt.sign(jwtPayload, process.env.PASSWORD_RESET_TOKEN_SECRET_KEY as Secret, { expiresIn: "30m" });
};

