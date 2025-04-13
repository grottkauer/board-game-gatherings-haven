
import React, { createContext, useContext, useState } from "react";
import { Event, Game, Participant, ChatMessage, EventRating, GameResult } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

// Sample dates for the events
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

const inTwoWeeks = new Date();
inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);

// Sample event data
const initialEvents: Event[] = [
  {
    id: "1",
    name: "Catan Championship",
    description: "Join us for a day of resource gathering and strategic trading in Catan!",
    location: "Board & Brew Cafe",
    city: "New York",
    date: tomorrow.toISOString(),
    maxPlayers: 6,
    host: {
      id: "1",
      nickname: "JohnDice"
    },
    participants: [
      { id: "1", nickname: "JohnDice" }
    ],
    games: [
      { id: "101", title: "Catan", description: "The classic game of resource management and trading" }
    ],
    chatMessages: [],
    ratings: [],
    gameResults: []
  },
  {
    id: "2",
    name: "Pandemic Cooperative Play",
    description: "Let's save the world together in this cooperative game of disease control!",
    location: "Meeple House",
    city: "San Francisco",
    date: nextWeek.toISOString(),
    maxPlayers: 4,
    host: {
      id: "2",
      nickname: "AliceCards"
    },
    participants: [
      { id: "2", nickname: "AliceCards" }
    ],
    games: [
      { id: "102", title: "Pandemic", description: "A cooperative game of disease control" }
    ],
    chatMessages: [],
    ratings: [],
    gameResults: []
  },
  {
    id: "3",
    name: "Strategy Game Night",
    description: "Multiple strategy games on rotation all night long!",
    location: "The Game Table",
    city: "Chicago",
    date: inTwoWeeks.toISOString(),
    maxPlayers: 8,
    host: {
      id: "3",
      nickname: "StrategyKing"
    },
    participants: [
      { id: "3", nickname: "StrategyKing" },
      { id: "1", nickname: "JohnDice" }
    ],
    games: [
      { id: "103", title: "Terraforming Mars", description: "Compete to make Mars habitable" },
      { id: "104", title: "Scythe", description: "Alternate-history strategy game set in 1920s Europe" }
    ],
    chatMessages: [],
    ratings: [],
    gameResults: []
  }
];

interface EventContextType {
  events: Event[];
  filteredEvents: Event[];
  cityFilter: string | null;
  dateFilter: string | null;
  setCityFilter: (city: string | null) => void;
  setDateFilter: (date: string | null) => void;
  createEvent: (newEvent: Omit<Event, "id" | "host" | "participants">) => void;
  joinEvent: (eventId: string) => void;
  leaveEvent: (eventId: string) => void;
  addGame: (eventId: string, game: Omit<Game, "id">) => void;
  getEvent: (eventId: string) => Event | undefined;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  sendChatMessage: (eventId: string, message: string) => void;
  rateEvent: (eventId: string, rating: number, comment?: string) => void;
  addGameResult: (eventId: string, gameResult: Omit<GameResult, "id" | "timestamp">) => void;
  markEventComplete: (eventId: string) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [cityFilter, setCityFilter] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const { user } = useAuth();

  // Apply filters to events
  const filteredEvents = events.filter(event => {
    // Apply city filter if selected
    if (cityFilter && event.city !== cityFilter) {
      return false;
    }
    
    // Apply date filter if selected
    if (dateFilter) {
      const eventDate = new Date(event.date).toDateString();
      const filterDate = new Date(dateFilter).toDateString();
      if (eventDate !== filterDate) {
        return false;
      }
    }
    
    return true;
  });

  const createEvent = (newEvent: Omit<Event, "id" | "host" | "participants">) => {
    if (!user) {
      toast.error("You must be logged in to create an event");
      return;
    }
    
    const createdEvent: Event = {
      ...newEvent,
      id: (events.length + 1).toString(),
      host: {
        id: user.id,
        nickname: user.nickname
      },
      participants: [
        { id: user.id, nickname: user.nickname }
      ],
      chatMessages: [],
      ratings: [],
      gameResults: []
    };
    
    setEvents([...events, createdEvent]);
    toast.success("Event created successfully!");
  };

  const joinEvent = (eventId: string) => {
    if (!user) {
      toast.error("You must be logged in to join an event");
      return;
    }
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Check if user is already a participant
        if (event.participants.some(p => p.id === user.id)) {
          toast.error("You are already participating in this event");
          return event;
        }
        
        // Check if event is full
        if (event.participants.length >= event.maxPlayers) {
          toast.error("This event is already full");
          return event;
        }
        
        // Add user to participants
        const updatedEvent = {
          ...event,
          participants: [...event.participants, { id: user.id, nickname: user.nickname }]
        };
        
        // Send a notification chat message
        if (updatedEvent.chatMessages) {
          const notification: ChatMessage = {
            id: `chat-${Date.now()}`,
            eventId: event.id,
            senderId: "system",
            senderNickname: "System",
            message: `${user.nickname} has joined the event!`,
            timestamp: new Date().toISOString()
          };
          updatedEvent.chatMessages = [...updatedEvent.chatMessages, notification];
        }
        
        toast.success("You have joined the event!");
        return updatedEvent;
      }
      return event;
    }));
  };

  const leaveEvent = (eventId: string) => {
    if (!user) {
      toast.error("You must be logged in to leave an event");
      return;
    }
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Check if user is the host
        if (event.host.id === user.id) {
          toast.error("As the host, you cannot leave your own event");
          return event;
        }
        
        // Check if user is a participant
        if (!event.participants.some(p => p.id === user.id)) {
          toast.error("You are not participating in this event");
          return event;
        }
        
        // Remove user from participants
        const updatedEvent = {
          ...event,
          participants: event.participants.filter(p => p.id !== user.id)
        };
        
        // Send a notification chat message
        if (updatedEvent.chatMessages) {
          const notification: ChatMessage = {
            id: `chat-${Date.now()}`,
            eventId: event.id,
            senderId: "system",
            senderNickname: "System",
            message: `${user.nickname} has left the event.`,
            timestamp: new Date().toISOString()
          };
          updatedEvent.chatMessages = [...updatedEvent.chatMessages, notification];
        }
        
        toast.success("You have left the event");
        return updatedEvent;
      }
      return event;
    }));
  };

  const addGame = (eventId: string, game: Omit<Game, "id">) => {
    if (!user) {
      toast.error("You must be logged in to add a game");
      return;
    }
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Check if user is the host or a participant
        if (event.host.id !== user.id && !event.participants.some(p => p.id === user.id)) {
          toast.error("You must be part of the event to add games");
          return event;
        }
        
        // Add game to the event
        const newGame: Game = {
          ...game,
          id: `game-${Date.now()}`
        };
        
        const updatedEvent = {
          ...event,
          games: [...event.games, newGame]
        };
        
        toast.success("Game added successfully!");
        return updatedEvent;
      }
      return event;
    }));
  };

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    if (!user) {
      toast.error("You must be logged in to update an event");
      return;
    }
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Check if user is the host
        if (event.host.id !== user.id) {
          toast.error("Only the host can update this event");
          return event;
        }
        
        // Update the event
        const updatedEvent = {
          ...event,
          ...updates
        };
        
        toast.success("Event updated successfully!");
        return updatedEvent;
      }
      return event;
    }));
  };

  const sendChatMessage = (eventId: string, message: string) => {
    if (!user) {
      toast.error("You must be logged in to send messages");
      return;
    }
    
    if (!message.trim()) {
      return;
    }
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Check if user is a participant
        if (!event.participants.some(p => p.id === user.id)) {
          toast.error("You must be part of the event to chat");
          return event;
        }
        
        const newMessage: ChatMessage = {
          id: `chat-${Date.now()}`,
          eventId,
          senderId: user.id,
          senderNickname: user.nickname,
          message: message.trim(),
          timestamp: new Date().toISOString()
        };
        
        const updatedEvent = {
          ...event,
          chatMessages: [...(event.chatMessages || []), newMessage]
        };
        
        return updatedEvent;
      }
      return event;
    }));
  };

  const rateEvent = (eventId: string, rating: number, comment?: string) => {
    if (!user) {
      toast.error("You must be logged in to rate an event");
      return;
    }
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Check if user is a participant
        if (!event.participants.some(p => p.id === user.id)) {
          toast.error("You must have participated in the event to rate it");
          return event;
        }
        
        // Check if event is completed
        if (!event.isCompleted) {
          toast.error("You can only rate events that have been completed");
          return event;
        }
        
        // Check if user has already rated
        if (event.ratings && event.ratings.some(r => r.userId === user.id)) {
          toast.error("You have already rated this event");
          return event;
        }
        
        const newRating: EventRating = {
          id: `rating-${Date.now()}`,
          userId: user.id,
          userNickname: user.nickname,
          rating,
          comment,
          timestamp: new Date().toISOString()
        };
        
        const updatedEvent = {
          ...event,
          ratings: [...(event.ratings || []), newRating]
        };
        
        toast.success("Thank you for rating this event!");
        return updatedEvent;
      }
      return event;
    }));
  };

  const addGameResult = (eventId: string, gameResult: Omit<GameResult, "id" | "timestamp">) => {
    if (!user) {
      toast.error("You must be logged in to record game results");
      return;
    }
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Check if user is a participant or host
        if (!event.participants.some(p => p.id === user.id)) {
          toast.error("You must be part of the event to record results");
          return event;
        }
        
        const newGameResult: GameResult = {
          ...gameResult,
          id: `result-${Date.now()}`,
          timestamp: new Date().toISOString()
        };
        
        const updatedEvent = {
          ...event,
          gameResults: [...(event.gameResults || []), newGameResult]
        };
        
        toast.success("Game result recorded!");
        return updatedEvent;
      }
      return event;
    }));
  };

  const markEventComplete = (eventId: string) => {
    if (!user) {
      toast.error("You must be logged in to mark an event as complete");
      return;
    }
    
    setEvents(events.map(event => {
      if (event.id === eventId) {
        // Check if user is the host
        if (event.host.id !== user.id) {
          toast.error("Only the host can mark the event as complete");
          return event;
        }
        
        const updatedEvent = {
          ...event,
          isCompleted: true
        };
        
        toast.success("Event marked as complete!");
        return updatedEvent;
      }
      return event;
    }));
  };

  const getEvent = (eventId: string) => {
    return events.find(event => event.id === eventId);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        filteredEvents,
        cityFilter,
        dateFilter,
        setCityFilter,
        setDateFilter,
        createEvent,
        joinEvent,
        leaveEvent,
        addGame,
        getEvent,
        updateEvent,
        sendChatMessage,
        rateEvent,
        addGameResult,
        markEventComplete
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
