import { Router, Request, Response, NextFunction } from "express";
import PostModel from "../models/Post";
import { adminMiddleware } from "../middleware/admin";
import { authMiddleware } from "../middleware/auth";
import LikeModel from "../models/Like";
import CommentModel from "../models/Comment";

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

// COMMENTS //

// @route POST /posts/:postId/comments
// @desc create a comment
// @access private
router.post(
  "/:postId/comments",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
      const comment = new CommentModel({
        userId: req.user.id,
        postId,
        content: req.body.content,
      });

      await comment.save();
      res.json({ msg: "Successfully commented" });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
);

// @route DELETE /posts/:postId/comments/:commentId
// @desc delete a comment
// @access private
router.delete(
  "/:postId/comments/:commentId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;

    try {
      const found = await CommentModel.findOne({
        userId: req.user.id,
        _id: commentId,
      });

      if (!found) {
        return res.status(404).json({ msg: "Not found" });
      }

      await found.delete();
      res.json({ msg: "Successfully deleted comment" });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
);

// @route PATCH /posts/:postId/comments/:commentId
// @desc edit a comment
// @access private
router.patch(
  "/:postId/comments/:commentId",
  authMiddleware,
  async (req: Request, res: Response) => {
    const comment = await CommentModel.findById(req.params.commentId);

    try {
      await comment?.update(req.body);
      res.json({ msg: "Successfully updated commented" });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  }
);

export default router;
