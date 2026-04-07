import axios from "axios";
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

export class PostsClient {
    constructor({
                    baseURL = process.env.API_BASE_URL,
                    timeout = 5000
                } = {}) {
        this.http = axios.create({
            baseURL,
            timeout,
            headers: {"Content-Type": "application/json"}
        });
    }

    getPosts() {
        return this.http.get(`/posts`).then(res => ({data: res.data, status: res.status}));
    }

    getPostById(id) {
        return this.http.get(`/posts/${id}`)
            .then(res => ({data: res.data, status: res.status}));
    }

    createPost(payload) {
        return this.http.post(`/posts`, payload).then(res => ({data: res.data, status: res.status}));
    }

    updatePost(id, payload) {
        return this.http.patch(`/posts/${id}`, payload).then(res => ({data: res.data, status: res.status}));
    }
}
