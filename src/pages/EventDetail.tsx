import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import EventChat from "@/components/EventChat";
import EventRating from "@/components/EventRating";
import GameResults from "@/components/GameResults";
import GamesSection from "@/components/GamesSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  ChevronLeft,
  Loader2,
  User,
  Edit,
  Save,
  X,
  Pen,
  BellPlus,
  CheckCircle
} from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { toast } from "sonner";

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { getEvent, joinEvent, leaveEvent, addGame, updateEvent, markEventComplete } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [newGameTitle, setNewGameTitle] = useState("");
  const [newGameDescription, setNewGameDescription] = useState("");
  const [showAddGame, setShowAddGame] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [editedCity, setEditedCity] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [editedTime, setEditedTime] = useState("");
  const [editedMaxPlayers, setEditedMaxPlayers] = useState(0);
  
  if (!eventId) {
    navigate("/");
    return null;
  }
  
  const event = getEvent(eventId);
  
  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setEditedName(event.name);
      setEditedDescription(event.description);
      setEditedLocation(event.location);
      setEditedCity(event.city);
      setEditedDate(format(eventDate, "yyyy-MM-dd"));
      setEditedTime(format(eventDate, "HH:mm"));
      setEditedMaxPlayers(event.maxPlayers);
    }
  }, [event]);
  
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
  const isEventPast = isPast(new Date(event.date));
  const chatMessages = event.chatMessages || [];
  const ratings = event.ratings || [];
  const gameResults = event.gameResults || [];
  
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  const timeFromNow = formatDistanceToNow(eventDate, { addSuffix: true });
  
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
  
  const handleSaveEdit = () => {
    const combinedDateTimeStr = `${editedDate}T${editedTime}`;
    const newDate = new Date(combinedDateTimeStr);
    
    if (isNaN(newDate.getTime())) {
      toast.error("Invalid date or time");
      return;
    }
    
    if (editedMaxPlayers < event.participants.length) {
      toast.error(`Maximum players cannot be less than current participants (${event.participants.length})`);
      return;
    }
    
    updateEvent(eventId, {
      name: editedName,
      description: editedDescription,
      location: editedLocation,
      city: editedCity,
      date: newDate.toISOString(),
      maxPlayers: editedMaxPlayers
    });
    
    setIsEditing(false);
  };
  
  const handleMarkComplete = () => {
    if (confirm("Are you sure you want to mark this event as complete? This cannot be undone.")) {
      markEventComplete(eventId);
    }
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
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-2xl font-bold text-board-purple">Edit Event</h2>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveEdit}
                      className="bg-board-purple hover:bg-board-purple-dark rounded-lg flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline"
                      className="rounded-lg"
                      onClick={() => setIsEditing(false)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Event Title</label>
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="rounded-lg"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="rounded-lg min-h-24"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      value={editedCity}
                      onChange={(e) => setEditedCity(e.target.value)}
                      className="rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input
                      type="date"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      className="rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Time</label>
                    <Input
                      type="time"
                      value={editedTime}
                      onChange={(e) => setEditedTime(e.target.value)}
                      className="rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Maximum Players</label>
                    <Input
                      type="number"
                      value={editedMaxPlayers}
                      onChange={(e) => setEditedMaxPlayers(parseInt(e.target.value))}
                      min={event.participants.length}
                      className="rounded-lg"
                      required
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-3xl font-bold text-board-purple">{event.name}</h1>
                      {event.isCompleted && (
                        <Badge className="bg-green-500 hover:bg-green-600 border-none">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-board-slate-light mt-1">{timeFromNow}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge className="bg-board-orange text-white hover:bg-board-orange border-none">
                      {event.participants.length}/{event.maxPlayers} players
                    </Badge>
                    
                    {isHost && !event.isCompleted && (
                      <Button
                        variant="outline"
                        className="rounded-lg border-board-purple text-board-purple hover:bg-board-purple/10"
                        onClick={() => setIsEditing(true)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
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
                    <div className="bg-board-green/20 p-3 rounded-lg">
                      <p className="font-medium">{event.host.nickname}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-6 mb-3">
                      <Users className="h-5 w-5 text-board-purple" />
                      <p className="font-medium">Participants ({event.participants.length})</p>
                    </div>
                    <div className="bg-board-green/20 p-3 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {event.participants.map((participant, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-1 bg-white rounded-full pl-1 pr-3 py-1 shadow-sm"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-board-purple text-white text-xs">
                                {participant.nickname.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {participant.nickname} {participant.id === event.host.id && "(Host)"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {!isEditing && user && !event.isCompleted && (
              <div className="flex justify-center mt-6">
                {isHost ? (
                  <div className="flex gap-2">
                    <Badge className="bg-board-purple border-none px-4 py-2 text-base">
                      You're hosting this event
                    </Badge>
                    {isEventPast && (
                      <Button 
                        className="bg-green-500 hover:bg-green-600 text-white gap-1"
                        onClick={handleMarkComplete}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                ) : isParticipant ? (
                  <Button 
                    variant="outline" 
                    className="rounded-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-700"
                    onClick={() => leaveEvent(eventId)}
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
          
          <div className="mb-6">
            <GamesSection eventId={eventId} isCompleted={!!event?.isCompleted} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {event.isCompleted ? (
              <EventRating 
                eventId={eventId} 
                isCompleted={event.isCompleted} 
                existingRatings={ratings} 
              />
            ) : (
              <GameResults 
                eventId={eventId}
                games={event.games}
                participants={event.participants}
                results={gameResults}
                isCompleted={!!event.isCompleted}
              />
            )}
          </div>
          
          {event.isCompleted && gameResults.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-board-slate mb-4">Game Results</h2>
              <GameResults 
                eventId={eventId}
                games={event.games}
                participants={event.participants}
                results={gameResults}
                isCompleted={!!event.isCompleted}
              />
            </div>
          )}
        </div>
      </main>
      
      {(isHost || isParticipant) && (
        <EventChat eventId={eventId} messages={chatMessages} />
      )}
    </div>
  );
};

export default EventDetail;
