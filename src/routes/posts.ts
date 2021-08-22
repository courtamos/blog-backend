import { Router, Request, Response, NextFunction } from "express";
import PostModel from "../models/Post";
import { adminMiddleware } from "../middleware/admin";

const router = Router();

// @route GET /posts
// @desc get all posts
// @access public
router.get("/", async (req: Request, res: Response) => {
  const posts = await PostModel.find().sort({ date: -1 });
  res.json(posts);
});

// @route POST /posts
// @desc create a new post
// @access private => admin only
router.post("/", adminMiddleware, async (req: Request, res: Response) => {
  const newPost = new PostModel({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
  });

  await newPost.save();
  res.json(newPost);
});

// @route DELETE /posts
// @desc delete a post
// @access private => admin only
router.delete("/:id", adminMiddleware, async (req: Request, res: Response) => {
  const post = await PostModel.findById(req.params.id);

  try {
    await post?.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false });
  }
});

// @route EDIT /posts/:id
// @desc edit a post
// @access private => admin only
router.patch("/:id", adminMiddleware, async (req: Request, res: Response) => {
  const post = await PostModel.findById(req.params.id);

  try {
    await post?.update(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({ success: false });
  }
});

export default router;
