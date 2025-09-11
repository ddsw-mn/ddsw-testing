import axios from "axios";
import dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

export class UserClient {

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

    getUsers() {
        return this.http.get(`/users`).then(res => ({data: res.data, status: res.status}));
    }

    getUserById(id) {
        return this.http.get(`/users/${id}`)
            .then(res => ({data: res.data, status: res.status}));
    }

    createUser(payload) {
        return this.http.post(`/users`, payload).then(res => ({data: res.data, status: res.status}));
    }

    updateUser(id, payload) {
        return this.http.put(`/users/${id}`, payload).then(res => ({data: res.data, status: res.status}));
    }

    deleteUser(id) {
        return this.http.delete(`/users/${id}`).then(res => ({data: res.data, status: res.status}));
    }

}