
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft } from "lucide-react";

const MyEvents = () => {
  const { events } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);
  
  if (!user) return null;
  
  // Filter events where user is the host
  const hostedEvents = events.filter(event => event.host.id === user.id);
  
  // Filter events where user is a participant but not the host
  const participatingEvents = events.filter(
    event => event.participants.some(p => p.id === user.id) && event.host.id !== user.id
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-board-cream">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <button 
          className="flex items-center text-board-slate hover:text-board-purple mb-6 transition-colors"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </button>
        
        <h1 className="text-3xl font-bold text-board-slate mb-6">My Events</h1>
        
        <Tabs defaultValue="hosting" className="mb-6">
          <TabsList className="grid grid-cols-2 w-[300px] rounded-full bg-board-green">
            <TabsTrigger value="hosting" className="rounded-full">
              Hosting ({hostedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="participating" className="rounded-full">
              Participating ({participatingEvents.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hosting" className="mt-6">
            {hostedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hostedEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <h3 className="text-xl font-medium text-board-slate mb-2">You're not hosting any events yet</h3>
                <p className="text-board-slate-light mb-6">
                  Create your first event and invite other board game enthusiasts to join you.
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate("/create-event")}
                >
                  Create New Event
                </button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="participating" className="mt-6">
            {participatingEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participatingEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <h3 className="text-xl font-medium text-board-slate mb-2">You haven't joined any events yet</h3>
                <p className="text-board-slate-light mb-6">
                  Browse upcoming events and join one that interests you.
                </p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate("/")}
                >
                  Find Events
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyEvents;
