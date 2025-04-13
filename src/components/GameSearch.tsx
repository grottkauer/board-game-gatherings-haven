
import { useState, useEffect, useRef } from "react";
import { searchGames, getGameDetails, BGGGame } from "@/services/boardGameGeekService";
import { useEvents } from "@/contexts/EventContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Search, Check, X } from "lucide-react";
import { toast } from "sonner";

interface GameSearchProps {
  eventId: string;
  onSelectGame?: (game: BGGGame) => void;
}

const GameSearch = ({ eventId, onSelectGame }: GameSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BGGGame[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<BGGGame | null>(null);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const { addGame } = useEvents();
  
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    searchTimeout.current = setTimeout(async () => {
      const results = await searchGames(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
    
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);
  
  const handleSelectGame = async (game: BGGGame) => {
    setIsSearching(true);
    const gameDetails = await getGameDetails(game.id);
    setIsSearching(false);
    
    if (gameDetails) {
      setSelectedGame(gameDetails);
      if (onSelectGame) {
        onSelectGame(gameDetails);
      }
    }
    
    setIsOpen(false);
    setSearchQuery("");
  };
  
  const handleAddGame = async () => {
    if (!selectedGame) return;
    
    setIsAddingGame(true);
    try {
      await addGame(eventId, {
        title: selectedGame.name,
        description: `${selectedGame.description.slice(0, 200)}... (${selectedGame.year}) - Players: ${selectedGame.minPlayers}-${selectedGame.maxPlayers}, Play Time: ${selectedGame.playingTime} min`
      });
      
      toast.success(`${selectedGame.name} added to the event!`);
      setSelectedGame(null);
    } catch (error) {
      console.error("Error adding game:", error);
      toast.error("Failed to add game. Please try again.");
    } finally {
      setIsAddingGame(false);
    }
  };
  
  const handleClearSelection = () => {
    setSelectedGame(null);
  };
  
  return (
    <div className="space-y-4">
      {!selectedGame ? (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                placeholder="Search for board games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full bg-white"
                onClick={() => setIsOpen(true)}
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-500" />
            </div>
          </PopoverTrigger>
          
          <PopoverContent className="p-0 w-[300px] md:w-[400px]" align="start">
            <Command>
              <CommandInput 
                placeholder="Search BoardGameGeek..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                {isSearching && (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-board-purple" />
                  </div>
                )}
                
                <CommandEmpty>No games found</CommandEmpty>
                
                <CommandGroup heading="Search Results">
                  {searchResults.map((game) => (
                    <CommandItem 
                      key={game.id}
                      value={game.id}
                      onSelect={() => handleSelectGame(game)}
                      className="flex items-center"
                    >
                      <span className="flex-1 truncate">{game.name}</span>
                      {game.year && <span className="text-gray-500 text-sm ml-2">({game.year})</span>}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4 border border-board-purple/30">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-board-purple">{selectedGame.name}</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-4">
            {selectedGame.thumbnail && (
              <img 
                src={selectedGame.thumbnail} 
                alt={selectedGame.name} 
                className="w-24 h-24 object-contain rounded"
              />
            )}
            
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">
                {selectedGame.year && `Published: ${selectedGame.year} • `}
                Players: {selectedGame.minPlayers}-{selectedGame.maxPlayers} • 
                Play Time: {selectedGame.playingTime} min
              </p>
              <p className="text-sm line-clamp-3">
                {selectedGame.description ? 
                  selectedGame.description.replace(/<[^>]*>?/gm, '').slice(0, 200) + '...' : 
                  'No description available'}
              </p>
            </div>
          </div>
          
          <div className="mt-3 flex justify-end">
            <Button 
              size="sm" 
              className="bg-board-purple hover:bg-board-purple-dark"
              onClick={handleAddGame}
              disabled={isAddingGame}
            >
              {isAddingGame ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Add to Event
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSearch;
