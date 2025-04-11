
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dice1, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-board-cream p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <Dice1 className="h-16 w-16 text-board-purple" />
        </div>
        <h1 className="text-4xl font-bold text-board-slate mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-board-purple mb-4">Page Not Found</h2>
        <p className="text-board-slate-light mb-8">
          Oops! The page you're looking for has either been lost in the shuffle or doesn't exist.
        </p>
        <Link to="/">
          <Button className="bg-board-purple hover:bg-board-purple-dark rounded-full flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
