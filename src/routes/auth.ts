import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/User";
import { authMiddleware } from "../middleware/auth";

dotenv.config();

const router = Router();
const jwtSecret = process.env.JWTSECRET || "";

// @route POST /auth/login
// @desc login route
// @access public
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ msg: "Please ensure all fields are filled out" });
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "User does not exist" });
  }

  // validate password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid password, try again" });
  }

  jwt.sign({ id: user.id }, jwtSecret, (err: any, token: any) => {
    try {
      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          subscribed: user.subscribed,
          type: user.type,
        },
      });
    } catch (err) {
      throw err;
    }
  });
});

export default router;
