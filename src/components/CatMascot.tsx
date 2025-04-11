
import { useState, useEffect } from "react";

interface CatMascotProps {
  message?: string;
}

const CatMascot = ({ message }: CatMascotProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);
  
  const defaultMessages = [
    "Ready to play some board games?",
    "Don't forget to bring snacks!",
    "Have you tried that new game yet?",
    "Let's roll the dice!",
    "Strategy is everything!",
    "Board games bring people together!",
  ];
  
  useEffect(() => {
    if (message) {
      setCurrentMessage(message);
      setShowMessage(true);
      
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  const handleCatClick = () => {
    if (!showMessage) {
      // Pick a random message
      const randomMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
      setCurrentMessage(randomMessage);
      setShowMessage(true);
      
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  };
  
  return (
    <div className="fixed bottom-6 left-6 z-10" onClick={handleCatClick}>
      <div className="relative">
        {showMessage && (
          <div className="absolute bottom-full left-0 mb-2 p-3 bg-white rounded-2xl shadow-md border border-board-purple-light max-w-[200px] text-sm">
            {currentMessage}
            <div className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-r border-b border-board-purple-light transform rotate-45"></div>
          </div>
        )}
        <div className="relative cursor-pointer hover:scale-105 transition-transform animate-float">
          <svg width="80" height="80" viewBox="0 0 24 24" className="drop-shadow-md">
            <path 
              fill="#9b87f5" 
              d="M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M12,14C12.6,14.8 13.4,15.15 14.2,15.15C14.6,15.15 15,15.05 15.4,14.85C15.73,14.69 16.1,14.61 16.5,14.61C17.1,14.61 17.71,14.84 18.2,15.05C18.3,15.08 18.41,15.06 18.5,15C18.58,14.94 18.62,14.83 18.62,14.72C18.62,14.67 18.61,14.63 18.59,14.59C18.03,13.37 16.38,12 14.5,12C13.37,12 12.37,12.67 12,13V14Z" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CatMascot;
