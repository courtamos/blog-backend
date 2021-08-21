import { Router } from "express";
import posts from "./posts";
import users from "./users";
import auth from "./auth";

const router = Router();

router.use("/posts", posts);
router.use("/users", users);
router.use("/auth", auth);

export default router;
