
import { useState } from "react";
import { useEvents } from "@/contexts/EventContext";
import { useAuth } from "@/contexts/AuthContext";
import { EventRating as EventRatingType } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface EventRatingProps {
  eventId: string;
  isCompleted: boolean;
  existingRatings: EventRatingType[];
}

const EventRating = ({ eventId, isCompleted, existingRatings }: EventRatingProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { rateEvent } = useEvents();
  const { user } = useAuth();
  
  if (!isCompleted) {
    return null;
  }
  
  const userRating = user && existingRatings.find(r => r.userId === user.id);
  const averageRating = existingRatings.length > 0
    ? existingRatings.reduce((sum, r) => sum + r.rating, 0) / existingRatings.length
    : 0;
  
  const handleSubmitRating = () => {
    if (rating > 0 && user && !userRating) {
      rateEvent(eventId, rating, comment);
      setComment("");
    }
  };
  
  return (
    <Card className="border-board-purple-light bg-board-cream/30">
      <CardHeader className="border-b border-board-purple-light/30">
        <CardTitle className="text-xl text-board-purple">Rate this Event</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {userRating ? (
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-8 w-8 ${star <= userRating.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <p className="text-green-600 font-medium">Thank you for your feedback!</p>
            {userRating.comment && (
              <div className="mt-2 p-3 bg-white rounded-lg">
                <p className="italic text-gray-600">"{userRating.comment}"</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <p className="text-center text-board-slate mb-6">
              How would you rate your experience at this event?
            </p>
            
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`h-12 w-12 cursor-pointer transition-all ${
                    star <= (hoverRating || rating) 
                      ? 'text-yellow-400 fill-yellow-400 scale-110' 
                      : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
            
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about the event (optional)"
              className="mb-4"
            />
            
            <Button 
              onClick={handleSubmitRating} 
              className="w-full bg-board-purple hover:bg-board-purple-dark"
              disabled={rating === 0 || !user}
            >
              Submit Rating
            </Button>
          </>
        )}
        
        {existingRatings.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-medium text-lg mb-4">Event Ratings & Reviews</h3>
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="text-3xl font-bold text-board-purple">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500">
                ({existingRatings.length} {existingRatings.length === 1 ? 'rating' : 'ratings'})
              </div>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {existingRatings
                .filter(r => r.comment)
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((r) => (
                  <div key={r.id} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{r.userNickname}</div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`h-4 w-4 ${
                              star <= r.rating
                                ? 'text-yellow-400 fill-yellow-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{r.comment}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventRating;
