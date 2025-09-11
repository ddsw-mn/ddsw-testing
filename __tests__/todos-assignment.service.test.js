import TodosAssignmentService from '../services/todos-assignment.service.js';
import { TodosClient } from '../clients/todos.client.js';
import { UserClient } from '../clients/user.client.js';

// Mock de los clientes
jest.mock('../clients/todos.client.js');
jest.mock('../clients/user.client.js');

describe('TodosAssignmentService', () => {
  let todosAssignmentService;
  let mockTodosClient;
  let mockUserClient;

  beforeEach(() => {
    // Reset todos los mocks antes de cada test
    jest.clearAllMocks();

    // Crear mocks de instancias de los clientes
    mockTodosClient = {
      getTodos: jest.fn(),
      getTodosById: jest.fn(),
      createTodos: jest.fn(),
      updateTodos: jest.fn(),
      deleteTodos: jest.fn()
    };

    mockUserClient = {
      getUsers: jest.fn(),
      getUserById: jest.fn(),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn()
    };

    // Configurar los mocks para que retornen las instancias mockeadas
    TodosClient.mockImplementation(() => mockTodosClient);
    UserClient.mockImplementation(() => mockUserClient);

    // Crear instancia del servicio
    todosAssignmentService = new TodosAssignmentService();
  });

  describe('constructor', () => {
    it('should create instances of TodosClient and UserClient', () => {
      expect(TodosClient).toHaveBeenCalledTimes(1);
      expect(UserClient).toHaveBeenCalledTimes(1);
      expect(todosAssignmentService.todosClient).toBe(mockTodosClient);
      expect(todosAssignmentService.usersClient).toBe(mockUserClient);
    });
  });

  describe('getUsersTodos', () => {
    const mockUsersData = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ];

    const mockTodosData = [
      { id: 1, userId: 1, title: 'Todo 1 for User 1', completed: false },
      { id: 2, userId: 1, title: 'Todo 2 for User 1', completed: true },
      { id: 3, userId: 2, title: 'Todo 1 for User 2', completed: false },
      { id: 4, userId: 2, title: 'Todo 2 for User 2', completed: false },
      { id: 5, userId: 4, title: 'Todo for non-existent user', completed: true }
    ];

    it('should return users with their assigned todos', async () => {
      // Setup mocks
      mockTodosClient.getTodos.mockResolvedValue({
        data: mockTodosData,
        status: 200
      });

      mockUserClient.getUsers.mockResolvedValue({
        data: mockUsersData,
        status: 200
      });

      // Execute
      const result = await todosAssignmentService.getUsersTodos();

      // Verify
      expect(mockTodosClient.getTodos).toHaveBeenCalledTimes(1);
      expect(mockUserClient.getUsers).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        data: [
          {
            user: { id: 1, name: 'John Doe', email: 'john@example.com' },
            todos: [
              { id: 1, userId: 1, title: 'Todo 1 for User 1', completed: false },
              { id: 2, userId: 1, title: 'Todo 2 for User 1', completed: true }
            ]
          },
          {
            user: { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            todos: [
              { id: 3, userId: 2, title: 'Todo 1 for User 2', completed: false },
              { id: 4, userId: 2, title: 'Todo 2 for User 2', completed: false }
            ]
          },
          {
            user: { id: 3, name: 'Bob Johnson', email: 'bob@example.com' },
            todos: []
          }
        ],
        status: 200
      });
    });

    it('should return empty arrays when no users exist', async () => {
      mockTodosClient.getTodos.mockResolvedValue({
        data: mockTodosData,
        status: 200
      });

      mockUserClient.getUsers.mockResolvedValue({
        data: [],
        status: 200
      });

      const result = await todosAssignmentService.getUsersTodos();

      expect(result).toEqual({
        data: [],
        status: 200
      });
    });

    it('should handle users with no todos', async () => {
      mockTodosClient.getTodos.mockResolvedValue({
        data: [],
        status: 200
      });

      mockUserClient.getUsers.mockResolvedValue({
        data: mockUsersData,
        status: 200
      });

      const result = await todosAssignmentService.getUsersTodos();

      expect(result.data).toHaveLength(3);
      result.data.forEach(userTodos => {
        expect(userTodos.todos).toEqual([]);
      });
    });

    it('should handle todos client error', async () => {
      const todosError = new Error('Failed to fetch todos');
      mockTodosClient.getTodos.mockRejectedValue(todosError);

      mockUserClient.getUsers.mockResolvedValue({
        data: mockUsersData,
        status: 200
      });

      await expect(todosAssignmentService.getUsersTodos()).rejects.toThrow('Failed to fetch todos');
      expect(mockTodosClient.getTodos).toHaveBeenCalledTimes(1);
      expect(mockUserClient.getUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle users client error', async () => {
      const usersError = new Error('Failed to fetch users');

      mockTodosClient.getTodos.mockResolvedValue({
        data: mockTodosData,
        status: 200
      });

      mockUserClient.getUsers.mockRejectedValue(usersError);

      await expect(todosAssignmentService.getUsersTodos()).rejects.toThrow('Failed to fetch users');
      expect(mockTodosClient.getTodos).toHaveBeenCalledTimes(1);
      expect(mockUserClient.getUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle both clients failing', async () => {
      const todosError = new Error('Todos service down');
      const usersError = new Error('Users service down');

      mockTodosClient.getTodos.mockRejectedValue(todosError);
      mockUserClient.getUsers.mockRejectedValue(usersError);

      // Promise.all falla con el primer error que ocurra
      await expect(todosAssignmentService.getUsersTodos()).rejects.toThrow();
    });
  });

  describe('getUserTodos', () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe'
    };

    const mockTodosData = [
      { id: 1, userId: 1, title: 'Todo 1 for User 1', completed: false },
      { id: 2, userId: 1, title: 'Todo 2 for User 1', completed: true },
      { id: 3, userId: 2, title: 'Todo for different user', completed: false }
    ];

    it('should return specific user with their todos', async () => {
      mockTodosClient.getTodos.mockResolvedValue({
        data: mockTodosData,
        status: 200
      });

      mockUserClient.getUserById.mockResolvedValue({
        data: mockUser,
        status: 200
      });

      const result = await todosAssignmentService.getUserTodos(1);

      expect(mockTodosClient.getTodos).toHaveBeenCalledTimes(1);
      expect(mockUserClient.getUserById).toHaveBeenCalledWith(1);

      expect(result).toEqual({
        data: {
          user: mockUser,
          todos: [
            { id: 1, userId: 1, title: 'Todo 1 for User 1', completed: false },
            { id: 2, userId: 1, title: 'Todo 2 for User 1', completed: true }
          ]
        },
        status: 200
      });
    });

    it('should return user with empty todos array when user has no todos', async () => {
      mockTodosClient.getTodos.mockResolvedValue({
        data: [
          { id: 3, userId: 2, title: 'Todo for different user', completed: false }
        ],
        status: 200
      });

      mockUserClient.getUserById.mockResolvedValue({
        data: mockUser,
        status: 200
      });

      const result = await todosAssignmentService.getUserTodos(1);

      expect(result).toEqual({
        data: {
          user: mockUser,
          todos: []
        },
        status: 200
      });
    });

    it('should handle string userId parameter', async () => {
      mockTodosClient.getTodos.mockResolvedValue({
        data: mockTodosData,
        status: 200
      });

      mockUserClient.getUserById.mockResolvedValue({
        data: mockUser,
        status: 200
      });

      await todosAssignmentService.getUserTodos('1');

      expect(mockUserClient.getUserById).toHaveBeenCalledWith('1');
      // El filtro debe convertir el string a number para la comparación
      // o manejar la comparación correctamente
    });

    it('should handle user not found error', async () => {
      const userError = {
        response: {
          status: 404,
          data: { message: 'User not found' }
        }
      };

      mockTodosClient.getTodos.mockResolvedValue({
        data: mockTodosData,
        status: 200
      });

      mockUserClient.getUserById.mockRejectedValue(userError);

      await expect(todosAssignmentService.getUserTodos(999)).rejects.toEqual(userError);
      expect(mockUserClient.getUserById).toHaveBeenCalledWith(999);
    });

    it('should handle todos fetch error', async () => {
      const todosError = new Error('Failed to fetch todos');

      mockTodosClient.getTodos.mockRejectedValue(todosError);
      mockUserClient.getUserById.mockResolvedValue({
        data: mockUser,
        status: 200
      });

      await expect(todosAssignmentService.getUserTodos(1)).rejects.toThrow('Failed to fetch todos');
    });

    it('should handle invalid userId types', async () => {
      mockTodosClient.getTodos.mockResolvedValue({
        data: mockTodosData,
        status: 200
      });

      mockUserClient.getUserById.mockResolvedValue({
        data: mockUser,
        status: 200
      });

      // Test con null
      await todosAssignmentService.getUserTodos(null);
      expect(mockUserClient.getUserById).toHaveBeenCalledWith(null);

      // Test con undefined
      await todosAssignmentService.getUserTodos(undefined);
      expect(mockUserClient.getUserById).toHaveBeenCalledWith(undefined);
    });
  });

  describe('integration scenarios', () => {
    it('should handle concurrent calls correctly', async () => {
      const mockUsers = [{ id: 1, name: 'User 1', email: 'user1@example.com' }];
      const mockTodos = [{ id: 1, userId: 1, title: 'Todo 1', completed: false }];

      mockTodosClient.getTodos.mockResolvedValue({
        data: mockTodos,
        status: 200
      });

      mockUserClient.getUsers.mockResolvedValue({
        data: mockUsers,
        status: 200
      });

      mockUserClient.getUserById.mockResolvedValue({
        data: mockUsers[0],
        status: 200
      });

      // Ejecutar ambos métodos concurrentemente
      const [allUsersResult, singleUserResult] = await Promise.all([
        todosAssignmentService.getUsersTodos(),
        todosAssignmentService.getUserTodos(1)
      ]);

      expect(allUsersResult.data).toHaveLength(1);
      expect(singleUserResult.data.user.id).toBe(1);

      // Verificar que los clientes fueron llamados el número correcto de veces
      expect(mockTodosClient.getTodos).toHaveBeenCalledTimes(2);
      expect(mockUserClient.getUsers).toHaveBeenCalledTimes(1);
      expect(mockUserClient.getUserById).toHaveBeenCalledTimes(1);
    });
  });
});
