import { Router, Request, Response, NextFunction } from "express";
import UserModel from "../models/User"
import bcrypt from "bcryptjs";

const router = Router();

// @route POST /users
// @desc register new user
// @access public
router.post('/', (req: Request, res: Response) => {
  const { firstName, lastName, email, password, subscribed, type } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: 'Please ensure all fields are filled out'});
  };

  UserModel.findOne({ email })
    .then(user => {
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

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err
          }

          newUser.password = hash;
          newUser.save()
            .then(user => {
              res.json({
                user: {
                  id: user.id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  subscribed: user.subscribed,
                  type: user.type
                }
              });
            });
        });
      });

    });
});

export default router;