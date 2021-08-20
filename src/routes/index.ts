import { Router } from "express";
import posts from "./posts";
import  users from "./users"

const router = Router();

router.use("/posts", posts);
router.use("/users", users);

export default router