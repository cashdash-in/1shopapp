
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
import { Input } from './ui/input';
import { Label } from './ui/label';
import type { Service } from './service-tile';
import { generateTileMetadata } from '@/ai/flows/tile-creation-flow';
import { Loader2, Wand2 } from 'lucide-react';

interface AddAppDialogProps {
  children: React.ReactNode;
  onAddService: (service: Service) => void;
}

export function AddAppDialog({ children, onAddService }: AddAppDialogProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleAddApp = async () => {
    setError('');

    // More robust client-side validation
    if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Please enter a full and valid URL (e.g., https://example.com).');
      return;
    }

    setLoading(true);

    try {
      // This is for format validation, although the check above is more user-friendly.
      new URL(url);

      const metadata = await generateTileMetadata({ url });
      
      const newService: Service = {
        name: metadata.name,
        href: url,
        icon: metadata.icon as any, // Cast because lucide icons are strings
        color: metadata.color,
      };

      onAddService(newService);
      setOpen(false); // Close the dialog on success
      
    } catch (err) {
      console.error(err);
      if (err instanceof TypeError) {
        setError("Invalid URL format. Please enter a full URL (e.g., https://example.com).");
      } else {
        setError("Could not analyze this URL. Please check the link or try another one.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        // Reset state when dialog closes
        setTimeout(() => {
            setUrl('');
            setError('');
            setLoading(false);
        }, 300)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New App or Website</DialogTitle>
          <DialogDescription>
            Enter the URL of the website you want to add. We'll use AI to create a tile for it automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com"
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-center text-destructive col-span-4">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleAddApp} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
                <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Create Tile
                </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
