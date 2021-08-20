import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import UserModel from "../models/User"

dotenv.config();

const router = Router();
const jwtSecret = process.env.JWTSECRET || '';

// @route POST /users
// @desc register new user
// @access public
router.post('/', async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, subscribed, type } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: 'Please ensure all fields are filled out'});
  };

  const user = await UserModel.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  const newUser = new UserModel({
    firstName,
    lastName,
    email,
    password,
    subscribed,
    type
  });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newUser.password, salt);
  newUser.password = hash;
  await newUser.save();

  jwt.sign({ id: newUser.id }, jwtSecret);
  res.json({
    user: {
      id: newUser.id,
      firstName: newUser.firstName,  
      lastName: newUser.lastName,
      email: newUser.email,
      subscribed: newUser.subscribed,
      type: newUser.type
    }      
  });
});

export default router;