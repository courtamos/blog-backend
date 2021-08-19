import { Router, Request, Response, NextFunction } from "express";
import PostModel from "../models/Post"

const router = Router();

// @route GET /posts
// @desc get all posts
// @access public
router.get('/', (req: Request, res: Response) => {
  PostModel.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
});

export default router;