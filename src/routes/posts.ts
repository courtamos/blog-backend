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
  const newPost = new PostModel({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category
  });

  newPost.save()
    .then(post => res.json(post));
});

// @route DELETE /posts
// @desc delete a post
// @access public
router.delete('/:id', (req: Request, res: Response) => {
  PostModel.findById(req.params.id)
    .then(post => post?.remove().then(() => res.json({success: true})))
    .catch(err => res.status(404).json({success: false}))
});
export default router;