import { TodosClient } from '../clients/todos.client.js';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('TodosClient', () => {
  let todosClient;
  let mockAxiosInstance;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Mock axios.create to return a mock instance
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    };

    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    // Create TodosClient instance
    todosClient = new TodosClient();
  });

  describe('constructor', () => {
    it('should create axios instance with default configuration', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: process.env.API_BASE_URL,
        timeout: 5000,
        headers: { "Content-Type": "application/json" }
      });
    });

    it('should create axios instance with custom configuration', () => {
      const customConfig = {
        baseURL: 'https://custom-api.com',
        timeout: 10000
      };

      new TodosClient(customConfig);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://custom-api.com',
        timeout: 10000,
        headers: { "Content-Type": "application/json" }
      });
    });
  });

  describe('getTodos', () => {
    it('should return todos data and status on success', async () => {
      const mockResponse = {
        data: [
          { id: 1, title: 'Todo 1', completed: false },
          { id: 2, title: 'Todo 2', completed: true }
        ],
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await todosClient.getTodos();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/todos');
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });

    it('should handle errors properly', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(todosClient.getTodos()).rejects.toThrow('Network error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/todos');
    });
  });

  describe('getTodosById', () => {
    it('should return specific todo by id', async () => {
      const mockResponse = {
        data: { id: 1, title: 'Todo 1', completed: false },
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await todosClient.getTodosById(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/todos/1');
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });
  });

  describe('createTodos', () => {
    it('should create a new todo', async () => {
      const newTodo = { title: 'New Todo', completed: false };
      const mockResponse = {
        data: { id: 3, ...newTodo },
        status: 201
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await todosClient.createTodos(newTodo);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/todos', newTodo);
      expect(result).toEqual({
        data: mockResponse.data,
        status: 201
      });
    });
  });

  describe('updateTodos', () => {
    it('should update an existing todo', async () => {
      const updatedTodo = { title: 'Updated Todo', completed: true };
      const mockResponse = {
        data: { id: 1, ...updatedTodo },
        status: 200
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await todosClient.updateTodos(1, updatedTodo);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/todos/1', updatedTodo);
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });
  });

  describe('deleteTodos', () => {
    it('should delete a todo', async () => {
      const mockResponse = {
        data: {},
        status: 200
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await todosClient.deleteTodos(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/todos/1');
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });
  });
});
