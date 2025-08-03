'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from './ui/textarea';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  onSkip: () => void;
  title: string;
  description: string;
}

export function RatingModal({ isOpen, onClose, onSubmit, onSkip, title, description }: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(rating, comment);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                            "h-8 w-8 cursor-pointer transition-colors",
                            (hoverRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        )}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                    />
                ))}
            </div>
            <Textarea 
                placeholder="Leave an optional comment..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
        </div>
        <DialogFooter>
            <Button variant="ghost" onClick={onSkip}>Skip</Button>
            <Button onClick={handleSubmit} disabled={rating === 0}>Submit Review</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}