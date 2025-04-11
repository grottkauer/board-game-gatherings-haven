
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const CreateEvent = () => {
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState(user?.city || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [gameTitle, setGameTitle] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !location || !city || !date || !time) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Combine date and time into a single Date object
    const eventDateTime = new Date(`${date}T${time}`);
    
    if (isNaN(eventDateTime.getTime())) {
      toast.error("Invalid date or time");
      return;
    }
    
    // Check if date is in the future
    if (eventDateTime < new Date()) {
      toast.error("Event date must be in the future");
      return;
    }
    
    const games = gameTitle.trim() 
      ? [{ title: gameTitle, description: gameDescription.trim() || undefined }] 
      : [];
    
    createEvent({
      name,
      description,
      location,
      city,
      date: eventDateTime.toISOString(),
      maxPlayers,
      games
    });
    
    navigate("/");
  };
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
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
        
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-board-slate mb-6">Create New Event</h1>
          
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Event Name *
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Board Game Night at Meeple Cafe"
                  className="rounded-lg"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description *
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell others about your event. What games will be played? Is it beginner-friendly? Any snacks provided?"
                  className="rounded-lg h-32"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location *
                  </label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Meeple Cafe, 123 Main St"
                    className="rounded-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-medium">
                    City *
                  </label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New York"
                    className="rounded-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Date *
                  </label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">
                    Time *
                  </label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="rounded-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="maxPlayers" className="text-sm font-medium">
                    Maximum Players *
                  </label>
                  <Input
                    id="maxPlayers"
                    type="number"
                    min="2"
                    max="20"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
                    className="rounded-lg"
                    required
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-board-slate pt-4">Add a Game (Optional)</h2>
              <p className="text-sm text-board-slate-light -mt-4 mb-2">
                You can add more games later.
              </p>
              
              <div className="space-y-2">
                <label htmlFor="gameTitle" className="text-sm font-medium">
                  Game Title
                </label>
                <Input
                  id="gameTitle"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="e.g. Catan, Ticket to Ride"
                  className="rounded-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="gameDescription" className="text-sm font-medium">
                  Game Description
                </label>
                <Textarea
                  id="gameDescription"
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                  placeholder="Brief description of the game or which version/expansion you'll bring"
                  className="rounded-lg h-20"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-board-purple hover:bg-board-purple-dark rounded-lg"
                >
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
