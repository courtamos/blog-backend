import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const jwtSecret = process.env.JWTSECRET || "";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("auth-token") || "";

  if (!token) {
    res.status(401).json({ msg: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded as Request["user"];
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token invalid" });
  }
};
