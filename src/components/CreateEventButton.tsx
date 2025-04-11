
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CreateEventButton = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <Link to="/create-event">
      <button className="fixed bottom-6 right-6 bg-board-purple text-white rounded-full p-4 shadow-lg hover:bg-board-purple-dark transition-all hover:scale-110 z-10">
        <Plus className="h-6 w-6" />
      </button>
    </Link>
  );
};

export default CreateEventButton;
