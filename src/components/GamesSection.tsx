
import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import GameSearch from "./GameSearch";
import GameVoting from "./GameVoting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Dice4 } from "lucide-react";

interface GamesSectionProps {
  eventId: string;
  isCompleted?: boolean;
}

const GamesSection = ({ eventId, isCompleted = false }: GamesSectionProps) => {
  const { getEvent } = useEvents();
  const { user } = useAuth();
  
  const event = getEvent(eventId);
  
  if (!event) return null;
  
  const isHost = user && event.host.id === user.id;
  const isParticipant = user && event.participants.some(p => p.id === user.id);
  
  return (
    <Card className="border-board-purple-light overflow-hidden">
      <CardHeader className="bg-board-purple/10 border-b border-board-purple-light/30">
        <CardTitle className="text-xl text-board-purple flex items-center gap-2">
          <Dice4 className="h-5 w-5" />
          Games for this Event
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {(isHost || isParticipant) && !isCompleted && (
          <>
            <div>
              <h3 className="text-lg font-medium text-board-purple mb-3">
                Add a Game
              </h3>
              <GameSearch eventId={eventId} />
            </div>
            
            <Separator className="bg-board-purple/10 my-6" />
          </>
        )}
        
        <GameVoting 
          games={event.games} 
          eventId={eventId}
          isParticipant={!!isParticipant} 
        />
      </CardContent>
    </Card>
  );
};

export default GamesSection;
