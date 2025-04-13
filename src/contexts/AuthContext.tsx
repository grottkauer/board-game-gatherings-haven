
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, FriendRequest } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nickname: string, city: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  updateProfile: (nickname: string, city: string, photoUrl?: string) => Promise<void>;
  isLoading: boolean;
  friends: User[];
  friendRequests: FriendRequest[];
  sendFriendRequest: (userId: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  declineFriendRequest: (requestId: string) => Promise<void>;
}

// Mock user data for demo purposes
const mockUsers = [
  {
    id: "1",
    email: "john@example.com",
    password: "password123", // In a real app, passwords would be hashed and not stored in the frontend
    nickname: "JohnDice",
    city: "New York",
    photoUrl: "https://source.unsplash.com/random/150x150/?person,1",
    isLoggedIn: false
  },
  {
    id: "2",
    email: "alice@example.com",
    password: "password123",
    nickname: "AliceCards",
    city: "San Francisco",
    photoUrl: "https://source.unsplash.com/random/150x150/?person,2",
    isLoggedIn: false
  },
  {
    id: "3",
    email: "mike@example.com",
    password: "password123",
    nickname: "MikeGames",
    city: "Chicago",
    photoUrl: "https://source.unsplash.com/random/150x150/?person,3",
    isLoggedIn: false
  },
  {
    id: "4",
    email: "sarah@example.com",
    password: "password123",
    nickname: "SarahPlays",
    city: "Boston",
    photoUrl: "https://source.unsplash.com/random/150x150/?person,4",
    isLoggedIn: false
  },
  {
    id: "5",
    email: "david@example.com",
    password: "password123",
    nickname: "DavidStrategy",
    city: "Seattle",
    photoUrl: "https://source.unsplash.com/random/150x150/?person,5",
    isLoggedIn: false
  }
];

// Mock friend relationships
const mockFriendships = [
  {
    id: "1",
    user1Id: "1", // John
    user2Id: "2", // Alice
    status: "accepted"
  },
  {
    id: "2",
    user1Id: "1", // John
    user2Id: "3", // Mike
    status: "pending"
  },
  {
    id: "3",
    user1Id: "4", // Sarah
    user2Id: "1", // John
    status: "pending"
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [friends, setFriends] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    // Check for saved user data in localStorage on app load
    const savedUser = localStorage.getItem("boardGameUser");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      
      // Load friends and friend requests
      if (parsedUser) {
        loadFriendsAndRequests(parsedUser.id);
      }
    }
    setIsLoading(false);
  }, []);

  const loadFriendsAndRequests = (userId: string) => {
    // Get accepted friendships
    const acceptedFriendships = mockFriendships.filter(
      f => (f.user1Id === userId || f.user2Id === userId) && f.status === "accepted"
    );
    
    // Get friend user objects
    const friendIds = acceptedFriendships.map(f => 
      f.user1Id === userId ? f.user2Id : f.user1Id
    );
    
    const friendsList = mockUsers.filter(u => friendIds.includes(u.id));
    setFriends(friendsList);
    
    // Get pending friend requests
    const incomingRequests = mockFriendships
      .filter(f => f.user2Id === userId && f.status === "pending")
      .map(f => ({
        id: f.id,
        senderId: f.user1Id,
        receiverId: f.user2Id,
        status: "pending" as const,
        sender: mockUsers.find(u => u.id === f.user1Id)!
      }));
      
    setFriendRequests(incomingRequests);
  };

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
      
      // Load friends and requests
      loadFriendsAndRequests(loggedInUser.id);
      
      toast.success("Login successful!");
    } else {
      toast.error("Invalid email or password");
    }
    
    setIsLoading(false);
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock Google login with a random user from our mock users
    const randomIndex = Math.floor(Math.random() * mockUsers.length);
    const randomUser = mockUsers[randomIndex];
    
    const { password, ...userWithoutPassword } = randomUser;
    const loggedInUser = { ...userWithoutPassword, isLoggedIn: true };
    
    setUser(loggedInUser);
    localStorage.setItem("boardGameUser", JSON.stringify(loggedInUser));
    
    // Load friends and requests
    loadFriendsAndRequests(loggedInUser.id);
    
    toast.success("Google login successful!");
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
      photoUrl: `https://source.unsplash.com/random/150x150/?person,${mockUsers.length + 1}`,
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
    setFriends([]);
    setFriendRequests([]);
    localStorage.removeItem("boardGameUser");
    toast.success("Logged out successfully");
  };

  const updateProfile = async (nickname: string, city: string, photoUrl?: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = { 
        ...user, 
        nickname, 
        city,
        ...(photoUrl && { photoUrl })
      };
      
      setUser(updatedUser);
      localStorage.setItem("boardGameUser", JSON.stringify(updatedUser));
      
      // Also update user in our mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { 
          ...mockUsers[userIndex], 
          nickname, 
          city,
          ...(photoUrl && { photoUrl })
        };
      }
      
      toast.success("Profile updated successfully!");
    }
    
    setIsLoading(false);
  };

  const sendFriendRequest = async (userId: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (!user) {
      toast.error("You must be logged in to send friend requests");
      setIsLoading(false);
      return;
    }
    
    // Check if friendship already exists
    const existingFriendship = mockFriendships.find(
      f => (f.user1Id === user.id && f.user2Id === userId) || 
           (f.user1Id === userId && f.user2Id === user.id)
    );
    
    if (existingFriendship) {
      if (existingFriendship.status === "accepted") {
        toast.error("You are already friends with this user");
      } else {
        toast.error("A friend request already exists");
      }
      setIsLoading(false);
      return;
    }
    
    // Create new friend request
    const newFriendRequest = {
      id: (mockFriendships.length + 1).toString(),
      user1Id: user.id,
      user2Id: userId,
      status: "pending"
    };
    
    mockFriendships.push(newFriendRequest);
    toast.success("Friend request sent!");
    
    setIsLoading(false);
  };

  const acceptFriendRequest = async (requestId: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find the request
    const requestIndex = mockFriendships.findIndex(f => f.id === requestId);
    
    if (requestIndex === -1) {
      toast.error("Friend request not found");
      setIsLoading(false);
      return;
    }
    
    // Update the request status
    mockFriendships[requestIndex].status = "accepted";
    
    // Reload friends and requests
    if (user) {
      loadFriendsAndRequests(user.id);
    }
    
    toast.success("Friend request accepted!");
    setIsLoading(false);
  };

  const declineFriendRequest = async (requestId: string): Promise<void> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find and remove the request
    const requestIndex = mockFriendships.findIndex(f => f.id === requestId);
    
    if (requestIndex === -1) {
      toast.error("Friend request not found");
      setIsLoading(false);
      return;
    }
    
    // Remove the request
    mockFriendships.splice(requestIndex, 1);
    
    // Reload friend requests
    if (user) {
      loadFriendsAndRequests(user.id);
    }
    
    toast.success("Friend request declined");
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      loginWithGoogle,
      logout, 
      updateProfile, 
      isLoading,
      friends,
      friendRequests,
      sendFriendRequest,
      acceptFriendRequest,
      declineFriendRequest
    }}>
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
