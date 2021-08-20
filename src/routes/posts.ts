import { Router, Request, Response, NextFunction } from "express";
import PostModel from "../models/Post"

const router = Router();

// @route GET /posts
// @desc get all posts
// @access public
router.get('/', async (req: Request, res: Response) => {
  const posts = await PostModel.find().sort({ date: -1 });
  res.json(posts);
});

// @route POST /posts
// @desc create a new post
// @access public
router.post('/', async (req: Request, res: Response) => {
  const newPost = new PostModel({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category
  });

  await newPost.save();
  res.json(newPost);
});

// @route DELETE /posts
// @desc delete a post
// @access public
router.delete('/:id', async (req: Request, res: Response) => {
  const post = await PostModel.findById(req.params.id)

  try {
    await post?.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false });
  }
});

export default router;