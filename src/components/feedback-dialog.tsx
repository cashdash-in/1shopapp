
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { submitFeedback } from '@/ai/flows/feedback-submission-flow';
import { ThumbsUp, MessageSquare } from 'lucide-react';

interface FeedbackDialogProps {
  children: React.ReactNode;
}

export function FeedbackDialog({ children }: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      setError("Please enter some feedback before submitting.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await submitFeedback({ text: feedback });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Sorry, we couldn't submit your feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        // Reset state after a short delay to allow the dialog to close smoothly
        setTimeout(() => {
            setFeedback('');
            setSubmitted(false);
            setError('');
            setLoading(false);
        }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onEscapeKeyDown={() => handleDialogChange(false)}>
        {submitted ? (
          <>
            <DialogHeader>
              <div className="flex flex-col items-center text-center">
                <ThumbsUp className="h-16 w-16 text-green-500 mb-4" />
                <DialogTitle className="text-2xl">Thank You!</DialogTitle>
                <DialogDescription className="mt-2">
                  Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
                </DialogDescription>
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => handleDialogChange(false)} className="w-full">Close</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
                <div className="flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary"/>
                    <DialogTitle className="text-2xl">Share Your Feedback</DialogTitle>
                </div>
              <DialogDescription>
                Have a suggestion or an issue? Let us know! Your input helps us make 1ShopApp better for everyone.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Textarea
                placeholder="What's on your mind?"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                disabled={loading}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => handleDialogChange(false)} disabled={loading}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

