import React from "react";
import { Star } from "lucide-react";

export default function StarRating({ rating = 5, size = 16 }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} star rating`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "text-gold fill-gold" : "text-beige fill-beige"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
