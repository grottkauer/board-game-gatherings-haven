
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventContext";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import EventFilter from "@/components/EventFilter";
import CreateEventButton from "@/components/CreateEventButton";
import CatMascot from "@/components/CatMascot";
import { Dice6 } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const { filteredEvents } = useEvents();

  return (
    <div className="min-h-screen flex flex-col bg-board-cream">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-board-slate mb-2">
            {user ? `Welcome back, ${user.nickname}!` : "Find Your Next Game Night"}
          </h1>
          <p className="text-board-slate-light max-w-2xl">
            Join fellow board game enthusiasts for exciting meetups. Browse upcoming events, create your own, and connect with players in your area.
          </p>
        </div>
        
        <EventFilter />
        
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-sm">
            <Dice6 className="h-16 w-16 text-board-purple-light mb-4" />
            <h3 className="text-xl font-medium text-board-slate mb-2">No events found</h3>
            <p className="text-board-slate-light text-center max-w-md mb-6">
              {user 
                ? "Why not create a new event and invite other board game enthusiasts to join you?"
                : "Sign up to create your own game event or check back later for new meetups!"}
            </p>
            {user && (
              <a href="/create-event" className="btn-primary">
                Create New Event
              </a>
            )}
          </div>
        )}
      </main>
      
      <CreateEventButton />
      <CatMascot message="Welcome to Board Haven! Find your next game night!" />
    </div>
  );
};

export default Index;
