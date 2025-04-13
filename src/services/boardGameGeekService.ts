
import { toast } from "sonner";

export interface BGGGame {
  id: string;
  name: string;
  year: string;
  description: string;
  image: string;
  thumbnail: string;
  minPlayers: number;
  maxPlayers: number;
  playingTime: number;
}

// Search games by name
export const searchGames = async (query: string): Promise<BGGGame[]> => {
  if (!query.trim()) return [];
  
  try {
    // Use a CORS proxy for the XML-based BGG API
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://boardgamegeek.com/xmlapi2/search?query=${query}&type=boardgame`
    )}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    const items = xmlDoc.querySelectorAll("item");
    const games: BGGGame[] = Array.from(items).slice(0, 5).map(item => {
      const id = item.getAttribute("id") || "";
      const nameElement = item.querySelector("name");
      const yearElement = item.querySelector("yearpublished");
      
      return {
        id,
        name: nameElement?.getAttribute("value") || "Unknown Game",
        year: yearElement?.getAttribute("value") || "",
        description: "",
        image: "",
        thumbnail: "",
        minPlayers: 0,
        maxPlayers: 0,
        playingTime: 0
      };
    });
    
    return games;
  } catch (error) {
    console.error("Error searching games:", error);
    toast.error("Failed to search for games. Please try again.");
    return [];
  }
};

// Get detailed game info
export const getGameDetails = async (gameId: string): Promise<BGGGame | null> => {
  try {
    // Use a CORS proxy for the XML-based BGG API
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(
      `https://boardgamegeek.com/xmlapi2/thing?id=${gameId}&stats=1`
    )}`);
    
    if (!response.ok) {
      throw new Error("Failed to fetch game details");
    }
    
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    
    const item = xmlDoc.querySelector("item");
    if (!item) return null;
    
    const name = item.querySelector("name[type='primary']")?.getAttribute("value") || "Unknown Game";
    const description = item.querySelector("description")?.textContent || "";
    const image = item.querySelector("image")?.textContent || "";
    const thumbnail = item.querySelector("thumbnail")?.textContent || "";
    const minPlayers = parseInt(item.querySelector("minplayers")?.getAttribute("value") || "0");
    const maxPlayers = parseInt(item.querySelector("maxplayers")?.getAttribute("value") || "0");
    const playingTime = parseInt(item.querySelector("playingtime")?.getAttribute("value") || "0");
    const yearPublished = item.querySelector("yearpublished")?.getAttribute("value") || "";
    
    return {
      id: gameId,
      name,
      year: yearPublished,
      description,
      image,
      thumbnail,
      minPlayers,
      maxPlayers,
      playingTime
    };
  } catch (error) {
    console.error("Error fetching game details:", error);
    toast.error("Failed to fetch game details. Please try again.");
    return null;
  }
};
