
export interface User {
  id: string;
  email: string;
  nickname: string;
  city: string;
  photoUrl: string; // Changed from optional to required
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

export interface ChatMessage {
  id: string;
  eventId: string;
  senderId: string;
  senderNickname: string;
  message: string;
  timestamp: string;
}

export interface EventRating {
  id: string;
  userId: string;
  userNickname: string;
  rating: number;
  comment?: string;
  timestamp: string;
}

export interface GameResult {
  id: string;
  gameId: string;
  gameTitle: string;
  winnerId?: string;
  winnerNickname?: string;
  players: Participant[];
  timestamp: string;
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
  isCompleted?: boolean;
  chatMessages?: ChatMessage[];
  ratings?: EventRating[];
  gameResults?: GameResult[];
}
