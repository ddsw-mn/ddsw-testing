import axios from "axios";
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

export class TodosClient {
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

    getTodos() {
        return this.http.get(`/todos`).then(res => ({data: res.data, status: res.status}));
    }

    getTodosById(id) {
        return this.http.get(`/todos/${id}`)
            .then(res => ({data: res.data, status: res.status}));
    }
    createTodos(payload) {
        return this.http.post(`/todos`, payload).then(res => ({data: res.data, status: res.status}));
    }

    updateTodos(id, payload) {
        return this.http.put(`/todos/${id}`, payload).then(res => ({data: res.data, status: res.status}));
    }

    deleteTodos(id) {
        return this.http.delete(`/todos/${id}`).then(res => ({data: res.data, status: res.status}));
    }
}
