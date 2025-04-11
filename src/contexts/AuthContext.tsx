
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string, city: string) => Promise<void>;
  logout: () => void;
  updateProfile: (nickname: string, city: string) => Promise<void>;
  isLoading: boolean;
}

// Mock user data for demo purposes
const mockUsers = [
  {
    id: "1",
    email: "john@example.com",
    password: "password123", // In a real app, passwords would be hashed and not stored in the frontend
    nickname: "JohnDice",
    city: "New York",
    isLoggedIn: false
  },
  {
    id: "2",
    email: "alice@example.com",
    password: "password123",
    nickname: "AliceCards",
    city: "San Francisco",
    isLoggedIn: false
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved user data in localStorage on app load
    const savedUser = localStorage.getItem("boardGameUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user with matching email and password
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      const loggedInUser = { ...userWithoutPassword, isLoggedIn: true };
      setUser(loggedInUser);
      localStorage.setItem("boardGameUser", JSON.stringify(loggedInUser));
      toast.success("Login successful!");
    } else {
      toast.error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  const register = async (email: string, password: string, nickname: string, city: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === email)) {
      toast.error("Email already in use");
      setIsLoading(false);
      return;
    }
    
    // Create new user
    const newUser: User & { password: string } = {
      id: (mockUsers.length + 1).toString(),
      email,
      password,
      nickname,
      city,
      isLoggedIn: true
    };
    
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem("boardGameUser", JSON.stringify(userWithoutPassword));
    toast.success("Registration successful!");
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("boardGameUser");
    toast.success("Logged out successfully");
  };

  const updateProfile = async (nickname: string, city: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = { ...user, nickname, city };
      setUser(updatedUser);
      localStorage.setItem("boardGameUser", JSON.stringify(updatedUser));
      
      // Also update user in our mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], nickname, city };
      }
      
      toast.success("Profile updated successfully!");
    }
    
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
