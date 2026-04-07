import { Router } from "express";
import PostsController from "../controllers/posts.controller.js";

const postsRouter = Router();

postsRouter.get("/", (req, res, next) => {
  PostsController.getPosts(req, res, next);
});

postsRouter.get("/:postId", (req, res, next) => {
  PostsController.getPostById(req, res, next);
});

postsRouter.post("/", (req, res, next) => {
  PostsController.createPost(req, res, next);
});

postsRouter.patch("/:postId", (req, res, next) => {
  PostsController.updatePost(req, res, next);
});

export default postsRouter;
