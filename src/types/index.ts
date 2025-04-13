
export interface User {
  id: string;
  email: string;
  nickname: string;
  city: string;
  photoUrl?: string;
  isLoggedIn: boolean;
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: "pending" | "accepted" | "declined";
  sender: User;
}

export interface Game {
  id: string;
  title: string;
  description?: string;
}

export interface Participant {
  id: string;
  nickname: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  city: string;
  date: string; // ISO string format
  maxPlayers: number;
  host: {
    id: string;
    nickname: string;
  };
  participants: Participant[];
  games: Game[];
}
