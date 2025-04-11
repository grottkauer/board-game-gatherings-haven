
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  Loader2,
  User
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { getEvent, joinEvent, leaveEvent, addGame } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [newGameTitle, setNewGameTitle] = useState("");
  const [newGameDescription, setNewGameDescription] = useState("");
  const [showAddGame, setShowAddGame] = useState(false);
  
  if (!eventId) {
    navigate("/");
    return null;
  }
  
  const event = getEvent(eventId);
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-board-cream">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-board-slate mb-4">Event not found</h1>
          <p className="text-board-slate-light mb-6">The event you're looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/")} className="flex items-center gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </main>
      </div>
    );
  }
  
  const isHost = user && event.host.id === user.id;
  const isParticipant = user && event.participants.some(p => p.id === user.id);
  const isFull = event.participants.length >= event.maxPlayers;
  
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  
  const handleAddGame = () => {
    if (!newGameTitle.trim()) {
      toast.error("Game title is required");
      return;
    }
    
    addGame(eventId, {
      title: newGameTitle,
      description: newGameDescription || undefined
    });
    
    setNewGameTitle("");
    setNewGameDescription("");
    setShowAddGame(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-board-cream">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-4 hover:bg-board-purple/10"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-board-purple">{event.name}</h1>
              <Badge className="bg-board-orange text-white hover:bg-board-orange border-none">
                {event.participants.length}/{event.maxPlayers} players
              </Badge>
            </div>
            
            <p className="text-board-slate mb-6">{event.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-board-purple" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-board-slate-light">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-board-purple" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-board-slate-light">{formattedTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-board-purple" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-board-slate-light">{event.location}, {event.city}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-board-purple" />
                  <p className="font-medium">Host</p>
                </div>
                <div className="bg-board-green p-3 rounded-lg">
                  <p>{event.host.nickname}</p>
                </div>
                
                <div className="flex items-center gap-3 mt-4 mb-3">
                  <Users className="h-5 w-5 text-board-purple" />
                  <p className="font-medium">Participants ({event.participants.length})</p>
                </div>
                <div className="bg-board-green p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {event.participants.map((participant, index) => (
                      <span 
                        key={index}
                        className="inline-block px-3 py-1 bg-white rounded-full text-sm shadow-sm"
                      >
                        {participant.nickname} {participant.id === event.host.id && "(Host)"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {user && (
              <div className="flex justify-center mt-6">
                {isHost ? (
                  <Badge className="bg-board-purple border-none px-4 py-2 text-base">You're hosting this event</Badge>
                ) : isParticipant ? (
                  <Button 
                    variant="outline" 
                    className="rounded-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      leaveEvent(eventId);
                      navigate("/");
                    }}
                  >
                    Leave Event
                  </Button>
                ) : (
                  <Button 
                    disabled={isFull}
                    className="bg-board-purple hover:bg-board-purple-dark rounded-full"
                    onClick={() => joinEvent(eventId)}
                  >
                    {isFull ? "Event is Full" : "Join Event"}
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-board-slate">Games</h2>
              
              {(isHost || isParticipant) && (
                <Button 
                  variant="outline" 
                  className="rounded-full"
                  onClick={() => setShowAddGame(!showAddGame)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Game
                </Button>
              )}
            </div>
            
            {showAddGame && (
              <div className="bg-board-cream/50 p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-3">Add a Game</h3>
                <div className="space-y-3">
                  <div>
                    <label htmlFor="gameTitle" className="text-sm font-medium block mb-1">
                      Game Title *
                    </label>
                    <Input
                      id="gameTitle"
                      value={newGameTitle}
                      onChange={(e) => setNewGameTitle(e.target.value)}
                      placeholder="e.g. Catan, Ticket to Ride"
                      className="rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="gameDescription" className="text-sm font-medium block mb-1">
                      Description (optional)
                    </label>
                    <Textarea
                      id="gameDescription"
                      value={newGameDescription}
                      onChange={(e) => setNewGameDescription(e.target.value)}
                      placeholder="Brief description of the game or which version/expansion you'll bring"
                      className="rounded-lg min-h-24"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      className="bg-board-purple hover:bg-board-purple-dark rounded-lg"
                      onClick={handleAddGame}
                    >
                      Add Game
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-lg"
                      onClick={() => setShowAddGame(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {event.games.length > 0 ? (
              <div className="space-y-4">
                {event.games.map((game, index) => (
                  <div key={index} className="p-4 border border-board-purple-light rounded-lg">
                    <h3 className="font-medium text-lg text-board-purple">{game.title}</h3>
                    {game.description && <p className="text-board-slate-light mt-1">{game.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-board-slate-light">No games added yet.</p>
                {(isHost || isParticipant) && (
                  <p className="mt-2 text-sm">Be the first to add a game!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventDetail;
