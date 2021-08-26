import { Router } from "express";
import posts from "./posts";
import users from "./users";
import auth from "./auth";
import admin from "./admin";

const router = Router();

router.use("/posts", posts);
router.use("/users", users);
router.use("/auth", auth);
router.use("/admin", admin);

export default router;
