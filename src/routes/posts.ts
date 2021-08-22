import { Router, Request, Response, NextFunction } from "express";
import PostModel from "../models/Post";
import { adminMiddleware } from "../middleware/admin";
import { authMiddleware } from "../middleware/auth";
import LikeModel from "../models/Like";

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
router.delete(
  "/:postId",
  adminMiddleware,
  async (req: Request, res: Response) => {
    const post = await PostModel.findById(req.params.postId);

    try {
      await post?.remove();
      res.json({ success: true });
    } catch (err) {
      res.status(404).json({ success: false });
    }
  }
);

// @route EDIT /posts/:postId
// @desc edit a post
// @access private => admin only
router.patch(
  "/:postId",
  adminMiddleware,
  async (req: Request, res: Response) => {
    const post = await PostModel.findById(req.params.postId);

    try {
      await post?.update(req.body);
      res.json({ success: true });
    } catch (err) {
      res.status(404).json({ success: false });
    }
  }
);

// LIKES //

// @route POST /posts/:postId/likes
// @desc like a post
// @access private
router.post(
  "/:postId/likes",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
      const found = await LikeModel.findOne({ userId: req.user.id, postId });

      if (found) {
        return res.status(400).json({ msg: "Cannot like again" });
      }

      const like = new LikeModel({
        userId: req.user.id,
        postId,
      });

      await like.save();
      res.json({ msg: "Successfully liked" });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
);

// @route DELETE /posts/:postId/likes
// @desc delete a like on a post
// @access private
router.delete(
  "/:postId/likes",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
      const found = await LikeModel.findOne({ userId: req.user.id, postId });

      if (!found) {
        return res.status(404).json({ msg: "Not found" });
      }

      await found.delete();
      res.json({ msg: "Successfully deleted like" });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
);

export default router;
