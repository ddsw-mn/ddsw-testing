import { UserClient } from '../clients/user.client.js';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}));

describe('UserClient', () => {
  let userClient;
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

    // Create UserClient instance
    userClient = new UserClient();
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

      new UserClient(customConfig);

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://custom-api.com',
        timeout: 10000,
        headers: { "Content-Type": "application/json" }
      });
    });
  });

  describe('getUsers', () => {
    it('should return users data and status on success', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            username: 'johndoe'
          },
          {
            id: 2,
            name: 'Jane Smith',
            email: 'jane@example.com',
            username: 'janesmith'
          }
        ],
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await userClient.getUsers();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });

    it('should handle empty users array', async () => {
      const mockResponse = {
        data: [],
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await userClient.getUsers();

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users');
      expect(result).toEqual({
        data: [],
        status: 200
      });
    });

    it('should handle network errors', async () => {
      const mockError = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(userClient.getUsers()).rejects.toThrow('Network error');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users');
    });

    it('should handle 404 not found error', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(userClient.getUsers()).rejects.toEqual(mockError);
    });
  });

  describe('getUserById', () => {
    it('should return specific user by id', async () => {
      const mockResponse = {
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          username: 'johndoe',
          address: {
            street: '123 Main St',
            city: 'Anytown'
          }
        },
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await userClient.getUserById(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });

    it('should handle string id parameter', async () => {
      const mockResponse = {
        data: { id: 1, name: 'John Doe' },
        status: 200
      };

      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await userClient.getUserById('1');

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });

    it('should handle user not found (404)', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'User not found' }
        }
      };
      mockAxiosInstance.get.mockRejectedValue(mockError);

      await expect(userClient.getUserById(999)).rejects.toEqual(mockError);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/users/999');
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        username: 'newuser'
      };
      const mockResponse = {
        data: { id: 3, ...newUser },
        status: 201
      };

      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await userClient.createUser(newUser);

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', newUser);
      expect(result).toEqual({
        data: mockResponse.data,
        status: 201
      });
    });

    it('should handle validation errors (400)', async () => {
      const invalidUser = { name: '' }; // Invalid user data
      const mockError = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            errors: ['Name is required', 'Email is required']
          }
        }
      };

      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(userClient.createUser(invalidUser)).rejects.toEqual(mockError);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/users', invalidUser);
    });

    it('should handle server errors (500)', async () => {
      const newUser = { name: 'Test User', email: 'test@example.com' };
      const mockError = {
        response: {
          status: 500,
          data: { message: 'Internal server error' }
        }
      };

      mockAxiosInstance.post.mockRejectedValue(mockError);

      await expect(userClient.createUser(newUser)).rejects.toEqual(mockError);
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updatedUser = {
        name: 'Updated User',
        email: 'updated@example.com'
      };
      const mockResponse = {
        data: { id: 1, ...updatedUser },
        status: 200
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await userClient.updateUser(1, updatedUser);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', updatedUser);
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { email: 'newemail@example.com' };
      const mockResponse = {
        data: {
          id: 1,
          name: 'Existing Name',
          email: 'newemail@example.com'
        },
        status: 200
      };

      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await userClient.updateUser(1, partialUpdate);

      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/1', partialUpdate);
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });

    it('should handle user not found for update', async () => {
      const updatedUser = { name: 'Updated User' };
      const mockError = {
        response: {
          status: 404,
          data: { message: 'User not found' }
        }
      };

      mockAxiosInstance.put.mockRejectedValue(mockError);

      await expect(userClient.updateUser(999, updatedUser)).rejects.toEqual(mockError);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/users/999', updatedUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const mockResponse = {
        data: {},
        status: 200
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await userClient.deleteUser(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual({
        data: mockResponse.data,
        status: 200
      });
    });

    it('should handle deletion with 204 No Content response', async () => {
      const mockResponse = {
        data: '',
        status: 204
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await userClient.deleteUser(1);

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1');
      expect(result).toEqual({
        data: '',
        status: 204
      });
    });

    it('should handle user not found for deletion', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'User not found' }
        }
      };

      mockAxiosInstance.delete.mockRejectedValue(mockError);

      await expect(userClient.deleteUser(999)).rejects.toEqual(mockError);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/999');
    });

    it('should handle string id parameter for deletion', async () => {
      const mockResponse = {
        data: {},
        status: 200
      };

      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      await userClient.deleteUser('1');

      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/users/1');
    });
  });

  describe('error handling', () => {
    it('should handle timeout errors', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 5000ms exceeded'
      };

      mockAxiosInstance.get.mockRejectedValue(timeoutError);

      await expect(userClient.getUsers()).rejects.toEqual(timeoutError);
    });

    it('should handle network connection errors', async () => {
      const networkError = {
        code: 'ENOTFOUND',
        message: 'getaddrinfo ENOTFOUND api.example.com'
      };

      mockAxiosInstance.get.mockRejectedValue(networkError);

      await expect(userClient.getUsers()).rejects.toEqual(networkError);
    });
  });
});
