// UserContext Formula:
// UserContext = State(token, user) + Actions(register, login, logout, updateProfile, changePassword)
//             + Provider(children) + localStorage(persistence)

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
  nickname: string | null;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
}

interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
  nickname?: string;
}

interface UpdateProfileInput {
  nickname?: string;
  bio?: string;
}

interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UserContextType {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  register: (input: RegisterInput) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
  changePassword: (input: ChangePasswordInput) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('user_token')
  );
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem('user_data') || 'null')
  );

  const isAuthenticated = !!token && !!user;

  // Set axios default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const register = async (input: RegisterInput) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, input);

      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);

      localStorage.setItem('user_token', newToken);
      localStorage.setItem('user_data', JSON.stringify(newUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email,
        password
      });

      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);

      localStorage.setItem('user_token', newToken);
      localStorage.setItem('user_data', JSON.stringify(newUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
  };

  const updateProfile = async (input: UpdateProfileInput) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/users/profile`, input);

      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Profile update failed');
    }
  };

  const changePassword = async (input: ChangePasswordInput) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/users/password`, input);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Password change failed');
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Avatar upload failed');
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile`);
      const updatedUser = response.data;
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to refresh profile');
    }
  };

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        uploadAvatar,
        refreshProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}