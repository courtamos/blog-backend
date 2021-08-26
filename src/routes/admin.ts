import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/User";
import { adminMiddleware } from "../middleware/admin";

dotenv.config();

const router = Router();
const jwtSecret = process.env.JWTSECRET || "";

// @route GET /admin/users
// @desc get all users for admin dashboard
// @access private => admin only
router.get("/users", adminMiddleware, async (req: Request, res: Response) => {
  const users = await UserModel.find()
    .sort({ firstName: 1 })
    .select("-password");
  res.json(users);
});

export default router;
