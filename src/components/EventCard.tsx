
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEvents } from "@/contexts/EventContext";
import { Link } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const { user } = useAuth();
  const { joinEvent, leaveEvent } = useEvents();
  
  const isHost = user && event.host.id === user.id;
  const isParticipant = user && event.participants.some(p => p.id === user.id);
  const isFull = event.participants.length >= event.maxPlayers;
  
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "MMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  const timeFromNow = formatDistanceToNow(eventDate, { addSuffix: true });

  return (
    <Card className="game-card overflow-hidden hover:scale-[1.02] transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-board-purple">{event.name}</CardTitle>
            <CardDescription>{timeFromNow}</CardDescription>
          </div>
          <Badge className="bg-board-orange text-white hover:bg-board-orange border-none">
            {event.participants.length}/{event.maxPlayers} players
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-2">{event.description}</p>
        
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-board-purple" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-board-purple" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-board-purple" />
            <span>{event.location}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-board-purple" />
            <div className="flex flex-wrap gap-1">
              {event.participants.slice(0, 3).map((participant, index) => (
                <span key={index} className="inline-block bg-board-green px-2 py-0.5 rounded-full text-xs">
                  {participant.nickname}
                </span>
              ))}
              {event.participants.length > 3 && (
                <span className="inline-block bg-board-green px-2 py-0.5 rounded-full text-xs">
                  +{event.participants.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Link to={`/events/${event.id}`}>
          <Button variant="outline" className="rounded-full">View Details</Button>
        </Link>
        
        {user ? (
          isHost ? (
            <Badge className="bg-board-purple border-none">You're hosting</Badge>
          ) : isParticipant ? (
            <Button 
              variant="outline" 
              className="rounded-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-700"
              onClick={() => leaveEvent(event.id)}
            >
              Leave Event
            </Button>
          ) : (
            <Button 
              disabled={isFull}
              className="bg-board-purple hover:bg-board-purple-dark rounded-full"
              onClick={() => joinEvent(event.id)}
            >
              {isFull ? "Event is Full" : "Join Event"}
            </Button>
          )
        ) : (
          <Link to="/login">
            <Button className="bg-board-purple hover:bg-board-purple-dark rounded-full">
              Login to Join
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
