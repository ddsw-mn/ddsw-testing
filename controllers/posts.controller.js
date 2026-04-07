import PostsService from "../services/posts.service.js";

class PostsController {
  constructor() {
    this.postsService = new PostsService();
  }

  getPosts = (req, res, next) => {
    this.postsService.getPosts()
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };

  getPostById = (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid postId parameter" });
    }
    this.postsService.getPostById(postId)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };

  createPost = (req, res, next) => {
    this.postsService.createPost(req.body)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };

  updatePost = (req, res, next) => {
    const postId = parseInt(req.params.postId, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid postId parameter" });
    }
    this.postsService.updatePost(postId, req.body)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };
}

export default new PostsController();
