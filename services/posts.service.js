import { PostsClient } from "../clients/posts.client.js";

class PostsService {
  constructor() {
    this.postsClient = new PostsClient();
  }

  getPosts() {
    return this.postsClient.getPosts();
  }

  getPostById(id) {
    return this.postsClient.getPostById(id);
  }

  createPost(payload) {
    return this.postsClient.createPost(payload);
  }

  updatePost(id, payload) {
    return this.postsClient.updatePost(id, payload);
  }
}

export default PostsService;
