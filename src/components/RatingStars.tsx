import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, maxRating = 5 }) => {
  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        return (
          <Star
            key={i}
            size={16}
            className={`${
              starValue <= rating
                ? 'text-amber-400 fill-amber-400'
                : starValue - 0.5 <= rating
                ? 'text-amber-400 fill-amber-400 opacity-50'
                : 'text-gray-300'
            } mr-0.5`}
          />
        );
      })}
      <span className="ml-1.5 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

export default RatingStars;