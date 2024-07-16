require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

export const authenticateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "User not Authenticated" });
  }

  jwt.verify(
    token as string,
    process.env.ACCESS_TOKEN_SECRET_KEY as Secret,
    (error, decode) => {
      if (error) {
        return res.status(401).json({ message: "Invalid token" });
      }

      res.locals.user = decode;

      next();
    }
  );
};

export const authenticatePasswordResetToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ error: "User not Authenticated" });
  }

  jwt.verify(
    token as string,
    process.env.PASSWORD_RESET_TOKEN_SECRET_KEY as Secret,
    (error, decode) => {
      if (error) {
        return res.status(401).json({ message: "Invalid token" });
      }

      res.locals.user = decode;

      next();
    }
  );
};
