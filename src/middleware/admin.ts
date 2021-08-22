import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserModel from "../models/User";

dotenv.config();
const jwtSecret = process.env.JWTSECRET || "";

export const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("auth-token") || "";

  if (!token) {
    res.status(401).json({ msg: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as Request["user"];
    const user = await UserModel.findById(decoded.id);

    if (!user || user.type !== "admin") {
      res.status(401).json({ msg: "Not authorized" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: "Token invalid" });
  }
};
