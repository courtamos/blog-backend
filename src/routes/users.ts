import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/User";
import { authMiddleware } from "../middleware/auth";

dotenv.config();

const router = Router();
const jwtSecret = process.env.JWTSECRET || "";

// @route POST /users
// @desc register new user
// @access public
router.post("/register", async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, subscribed, type } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ msg: "Please ensure all fields are filled out" });
  }

  const user = await UserModel.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const newUser = new UserModel({
    firstName,
    lastName,
    email,
    password,
    subscribed,
    type,
  });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newUser.password, salt);
  newUser.password = hash;
  await newUser.save();

  jwt.sign({ id: newUser.id }, jwtSecret, (err: any, token: any) => {
    try {
      res.json({
        token,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          subscribed: newUser.subscribed,
          type: newUser.type,
        },
      });
    } catch (err) {
      throw err;
    }
  });
});

// @route GET /users
// @desc get users data
// @access private
router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserModel.findById(req.user.id).select("-password");
    res.json(user);
  }
);

export default router;
