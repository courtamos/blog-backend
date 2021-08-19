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

// @route POST /posts
// @desc create a new post
// @access public
router.post('/', (req: Request, res: Response) => {
  console.log(req.body)
  const newPost = new PostModel({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category
  });

  newPost.save()
    .then(post => res.json(post));
});

export default router;