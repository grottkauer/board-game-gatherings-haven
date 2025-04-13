
import { useState } from "react";
import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import { GameResult, Game, Participant } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Trophy, Users, ChevronDown } from "lucide-react";

interface GameResultsProps {
  eventId: string;
  games: Game[];
  participants: Participant[];
  results: GameResult[];
  isCompleted: boolean;
}

const GameResults = ({ eventId, games, participants, results, isCompleted }: GameResultsProps) => {
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [selectedWinner, setSelectedWinner] = useState<string>("");
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [showAddResult, setShowAddResult] = useState(false);
  
  const { addGameResult } = useEvents();
  const { user } = useAuth();
  
  const handleAddResult = () => {
    if (!selectedGame || !selectedPlayers.length) return;
    
    const gameToAdd = games.find(g => g.id === selectedGame);
    if (!gameToAdd) return;
    
    const winner = participants.find(p => p.id === selectedWinner);
    const players = participants.filter(p => selectedPlayers.includes(p.id));
    
    addGameResult(eventId, {
      gameId: selectedGame,
      gameTitle: gameToAdd.title,
      winnerId: winner?.id,
      winnerNickname: winner?.nickname,
      players: players
    });
    
    // Reset form
    setSelectedGame("");
    setSelectedWinner("");
    setSelectedPlayers([]);
    setShowAddResult(false);
  };
  
  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
      // If removed player was the winner, clear winner
      if (playerId === selectedWinner) {
        setSelectedWinner("");
      }
    } else {
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };
  
  return (
    <Card className="border-board-green-light">
      <CardHeader className="flex flex-row items-center justify-between border-b border-board-green-light/30">
        <CardTitle className="text-xl text-board-green">Game Results</CardTitle>
        {isCompleted && user && (
          <Button
            variant="outline"
            className="border-board-green text-board-green hover:bg-board-green/10"
            onClick={() => setShowAddResult(!showAddResult)}
          >
            {showAddResult ? "Cancel" : "Record Result"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        {showAddResult && (
          <div className="bg-board-green/10 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-4">Record a Game Result</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select Game</label>
                <Select value={selectedGame} onValueChange={setSelectedGame}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a game..." />
                  </SelectTrigger>
                  <SelectContent>
                    {games.map((game) => (
                      <SelectItem key={game.id} value={game.id}>
                        {game.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Select Players</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {participants.map((player) => (
                    <Badge 
                      key={player.id}
                      variant={selectedPlayers.includes(player.id) ? "default" : "outline"}
                      className={`cursor-pointer ${
                        selectedPlayers.includes(player.id) 
                          ? "bg-board-green hover:bg-board-green-dark" 
                          : "text-board-green hover:border-board-green"
                      }`}
                      onClick={() => togglePlayerSelection(player.id)}
                    >
                      {player.nickname}
                    </Badge>
                  ))}
                </div>
                {selectedPlayers.length === 0 && (
                  <p className="text-xs text-amber-600">Please select at least one player</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Select Winner (optional)</label>
                <Select 
                  value={selectedWinner} 
                  onValueChange={setSelectedWinner}
                  disabled={selectedPlayers.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a winner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No winner / Cooperative game</SelectItem>
                    {participants
                      .filter(p => selectedPlayers.includes(p.id))
                      .map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.nickname}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddResult}
                className="bg-board-green hover:bg-board-green-dark"
                disabled={!selectedGame || selectedPlayers.length === 0}
              >
                Save Result
              </Button>
            </div>
          </div>
        )}
        
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-board-green/10 p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="font-medium">{result.gameTitle}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {format(new Date(result.timestamp), "MMM d, h:mm a")}
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center mb-2">
                    <Users className="h-4 w-4 text-board-green mr-2" />
                    <span className="text-sm font-medium">Players:</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {result.players.map((player) => (
                      <Badge 
                        key={player.id}
                        variant="outline"
                        className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600"
                      >
                        {player.nickname}
                      </Badge>
                    ))}
                  </div>
                  
                  {result.winnerId && (
                    <>
                      <div className="flex items-center mb-2">
                        <Trophy className="h-4 w-4 text-yellow-500 mr-2" />
                        <span className="text-sm font-medium">Winner:</span>
                      </div>
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">
                        {result.winnerNickname}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No game results recorded yet</p>
            {isCompleted && (
              <p className="mt-2 text-sm">
                {user ? "Record your first game result!" : "Login to record game results"}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameResults;
