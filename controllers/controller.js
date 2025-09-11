import TodosAssignmentService from "../services/todos-assignment.service.js";

class Controller {
  constructor() {
    this.todosAssignmentService = new TodosAssignmentService();
  }

  getUsersAssignments = (req, res, next) => {
    this.todosAssignmentService.getUsersTodos()
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };

  getUserAssignment = (req, res, next) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid userId parameter" });
    }
    this.todosAssignmentService.getUserTodos(userId)
      .then(({ data, status }) => res.status(status).json(data))
      .catch(next);
  };
}

export default new Controller();
