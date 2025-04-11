
import React, { createContext, useContext, useState } from "react";
import { Event, Game, Participant } from "@/types";
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
    ]
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
    ]
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
    ]
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
      ]
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
        getEvent
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
