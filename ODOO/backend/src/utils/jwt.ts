import jwt from "jsonwebtoken";
import config from "../config/config";
import { UserRole } from "../types";

export const generateToken = (payload: {
  id: string;
  email: string;
  role: UserRole;
}): string => {
  return jwt.sign(
    payload,
    config.jwtSecret as string,
    { expiresIn: config.jwtExpire } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwtSecret as string);
  } catch (error) {
    throw new Error("Invalid token");
  }
};
