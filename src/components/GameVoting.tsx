
import { useState } from "react";
import { Game } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Users } from "lucide-react";
import { toast } from "sonner";

interface GameVote {
  gameId: string;
  userId: string;
  vote: 'up' | 'down' | null;
}

interface GameVotingProps {
  games: Game[];
  eventId: string;
  isParticipant: boolean;
}

const GameVoting = ({ games, eventId, isParticipant }: GameVotingProps) => {
  const { user } = useAuth();
  const [gameVotes, setGameVotes] = useState<Record<string, GameVote[]>>({});
  
  const handleVote = (gameId: string, voteType: 'up' | 'down') => {
    if (!user || !isParticipant) {
      toast.error("You must be a participant to vote for games");
      return;
    }
    
    setGameVotes(prev => {
      const gameVoteList = prev[gameId] || [];
      const existingVoteIndex = gameVoteList.findIndex(v => v.userId === user.id);
      
      let updatedVotes = [...gameVoteList];
      
      if (existingVoteIndex >= 0) {
        // User already voted for this game
        const existingVote = gameVoteList[existingVoteIndex];
        
        if (existingVote.vote === voteType) {
          // Remove vote if clicking the same button again
          updatedVotes.splice(existingVoteIndex, 1);
        } else {
          // Change vote type
          updatedVotes[existingVoteIndex] = { ...existingVote, vote: voteType };
        }
      } else {
        // Add new vote
        updatedVotes.push({
          gameId,
          userId: user.id,
          vote: voteType
        });
      }
      
      return {
        ...prev,
        [gameId]: updatedVotes
      };
    });
  };
  
  const getVoteCounts = (gameId: string) => {
    const votes = gameVotes[gameId] || [];
    const upvotes = votes.filter(v => v.vote === 'up').length;
    const downvotes = votes.filter(v => v.vote === 'down').length;
    return { upvotes, downvotes, total: votes.length };
  };
  
  const getUserVote = (gameId: string) => {
    if (!user) return null;
    const votes = gameVotes[gameId] || [];
    const userVote = votes.find(v => v.userId === user.id);
    return userVote?.vote || null;
  };
  
  if (games.length === 0) {
    return (
      <Card className="border-board-purple-light">
        <CardContent className="pt-6 text-center text-gray-500">
          <p>No games have been added to this event yet.</p>
          <p className="text-sm mt-2">Add a game to start voting!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border-board-purple-light">
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium text-board-purple mb-4">Vote for Games</h3>
        
        <div className="space-y-4">
          {games.map((game) => {
            const { upvotes, downvotes, total } = getVoteCounts(game.id);
            const userVote = getUserVote(game.id);
            
            return (
              <div 
                key={game.id} 
                className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
              >
                <h4 className="font-medium text-board-purple">{game.title}</h4>
                {game.description && (
                  <p className="text-sm text-gray-600 mt-1 mb-3">{game.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button 
                      variant={userVote === 'up' ? 'default' : 'outline'}
                      size="sm"
                      className={`rounded-full ${userVote === 'up' ? 'bg-green-500 hover:bg-green-600' : 'border-green-500 text-green-500 hover:bg-green-50'}`}
                      onClick={() => handleVote(game.id, 'up')}
                      disabled={!isParticipant}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {upvotes > 0 && <span>{upvotes}</span>}
                    </Button>
                    
                    <Button 
                      variant={userVote === 'down' ? 'default' : 'outline'}
                      size="sm"
                      className={`rounded-full ${userVote === 'down' ? 'bg-red-500 hover:bg-red-600' : 'border-red-500 text-red-500 hover:bg-red-50'}`}
                      onClick={() => handleVote(game.id, 'down')}
                      disabled={!isParticipant}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      {downvotes > 0 && <span>{downvotes}</span>}
                    </Button>
                  </div>
                  
                  {total > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      {total} vote{total !== 1 && 's'}
                    </div>
                  )}
                </div>
                
                {!isParticipant && total > 0 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Join this event to vote for games!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameVoting;
