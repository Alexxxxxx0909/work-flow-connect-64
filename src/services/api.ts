import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
  },
  
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data.user;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }
};

export const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  getUserById: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }
};

export const chatService = {
  getChats: async () => {
    const response = await api.get('/chats');
    return response.data;
  },
  
  createPrivateChat: async (userId: string) => {
    const response = await api.post('/chats/private', { userId });
    return response.data;
  },
  
  createGroupChat: async (name: string, participants: string[]) => {
    const response = await api.post('/chats/group', { name, participants });
    return response.data;
  },
  
  addUsersToChat: async (chatId: string, userIds: string[]) => {
    const response = await api.post(`/chats/${chatId}/users`, { userIds });
    return response.data;
  },
  
  leaveChat: async (chatId: string) => {
    const response = await api.post(`/chats/${chatId}/leave`);
    return response.data;
  },
  
  deleteChat: async (chatId: string) => {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
  }
};

export const messageService = {
  getMessages: async (chatId: string) => {
    const response = await api.get(`/messages/${chatId}`);
    return response.data;
  },
  
  sendMessage: async (chatId: string, text: string) => {
    const response = await api.post('/messages', { chatId, text });
    return response.data;
  },
  
  updateMessage: async (messageId: string, text: string) => {
    const response = await api.put(`/messages/${messageId}`, { text });
    return response.data;
  },
  
  deleteMessage: async (messageId: string) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  }
};

export const fileService = {
  uploadFile: async (chatId: string, file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const data = e.target?.result?.toString().split(',')[1]; // Get base64 data
          
          if (!data) {
            throw new Error('Failed to read file');
          }
          
          const response = await api.post('/files', {
            chatId,
            filename: file.name,
            contentType: file.type,
            size: file.size,
            data
          });
          
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  },
  
  getFileUrl: (fileId: string) => {
    const token = localStorage.getItem('auth_token');
    return `http://localhost:5000/api/files/${fileId}?token=${token}`;
  }
};

export const socketService = {
  socket: null as any,
  
  connect: (token: string) => {
    const io = require('socket.io-client');
    
    socketService.socket = io('http://localhost:5000', {
      auth: { token }
    });
    
    return socketService.socket;
  },
  
  disconnect: () => {
    if (socketService.socket) {
      socketService.socket.disconnect();
      socketService.socket = null;
    }
  }
};

export default api;
