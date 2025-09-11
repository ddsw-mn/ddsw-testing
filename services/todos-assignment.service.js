import { TodosClient } from "../clients/todos.client.js";
import { UserClient } from "../clients/user.client.js";

class TodosAssignmentService {
  constructor() {
    this.todosClient = new TodosClient();
    this.usersClient = new UserClient();
  }

  getUsersTodos() {
     let todos = this.todosClient.getTodos();
     let users = this.usersClient.getUsers();
     return Promise.all([todos, users]).then(([todosRes, usersRes]) => {
         let todosData = todosRes.data;
         let usersData = usersRes.data;
         let combined = usersData.map(user => {
             let userTodos = todosData.filter(todo => todo.userId === user.id);
             return {
                 user: { id: user.id, name: user.name, email: user.email },
                 todos: userTodos
             };
         });
         return { data: combined, status: 200 };
     });
  }

  getUserTodos(userId) {
    return Promise.all([this.todosClient.getTodos(), this.usersClient.getUserById(userId)])
      .then(([todosRes, userRes]) => {
        return {
          data: {
            user: userRes.data,
            todos: todosRes.data.filter(todo => todo.userId === userId)
          },
          status: 200
        };
      });
  }
}

export default TodosAssignmentService;
