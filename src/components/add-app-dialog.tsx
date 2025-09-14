
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
import { Loader2, Wand2, PlusCircle } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AddAppDialogProps {
  children: React.ReactNode;
  onAddService: (service: Service) => void;
}

const iconOptions = [
    'ShoppingCart', 'UtensilsCrossed', 'Receipt', 'Plane', 'Shield', 'Landmark', 'Truck', 'Users', 'Newspaper', 'Search', 'Building2', 'Ticket', 'Mail', 'Book', 'Briefcase', 'Film', 'Music', 'PenTool', 'FileText', 'Github', 'Globe', 'Home', 'Heart', 'Headphones', 'Camera', 'Cloud', 'Code', 'CreditCard', 'Database', 'DollarSign', 'Download', 'ExternalLink', 'File', 'Folder', 'Gift', 'Image', 'Instagram', 'Layout', 'Link', 'Lock', 'LogIn', 'LogOut', 'Map', 'MessageCircle', 'Monitor', 'Moon', 'MousePointer', 'Package', 'Palette', 'Phone', 'Play', 'Plus', 'Settings', 'Share2', 'Smile', 'Sun', 'Tag', 'Target', 'ThumbsUp', 'Trash2', 'TrendingUp', 'Twitter', 'Upload', 'Video', 'Wallet', 'Wifi', 'Youtube', 'Zap'
];


export function AddAppDialog({ children, onAddService }: AddAppDialogProps) {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [open, setOpen] = useState(false);

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [color, setColor] = useState('#000000');
  
  const [manualMode, setManualMode] = useState(false);

  const resetLocalState = () => {
    setUrl('');
    setIsAnalyzing(false);
    setAnalysisError('');
    setName('');
    setIcon('');
    setColor('#000000');
    setManualMode(false);
  }

  const handleAnalyzeUrl = async () => {
    if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
      setAnalysisError('Please enter a full and valid URL (e.g., https://example.com).');
      return;
    }
    setAnalysisError('');
    setIsAnalyzing(true);
    setManualMode(true); // Show manual fields immediately

    try {
      new URL(url); // Validate URL format
      const metadata = await generateTileMetadata({ url });
      
      // Pre-fill the manual fields with AI suggestions
      setName(metadata.name);
      setIcon(metadata.icon);
      setColor(metadata.color);

    } catch (err) {
      console.error(err);
      setAnalysisError("AI analysis failed. Please fill in the details manually.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddService = () => {
    if (!name || !icon || !color) {
        setAnalysisError("Please fill out all fields.");
        return;
    }

     const newService: Service = {
        name,
        href: url,
        icon: icon as any,
        color,
      };

      onAddService(newService);
      setOpen(false); // This will trigger the onOpenChange and reset state.
  }
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        setTimeout(resetLocalState, 300);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New App or Website</DialogTitle>
          <DialogDescription>
            Enter a URL to have AI generate a tile, or fill in the details manually.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
            {/* URL Input */}
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
                disabled={isAnalyzing}
                />
            </div>

             {/* Analyze Button */}
            <div className="flex justify-end">
                <Button onClick={handleAnalyzeUrl} disabled={isAnalyzing || !url}>
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Analyze URL
                        </>
                    )}
                </Button>
            </div>

            {/* Manual Entry Fields */}
            {manualMode && (
                <div className="space-y-4 pt-4 border-t">
                    <p className={cn("text-sm text-center", analysisError ? "text-destructive" : "text-muted-foreground")}>
                        {analysisError || "Edit the AI suggestions or enter details for the new tile."}
                    </p>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., Google Docs"/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="icon" className="text-right">Icon</Label>
                        <Select value={icon} onValueChange={setIcon}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select an icon" />
                            </SelectTrigger>
                            <SelectContent>
                                {iconOptions.map((iconName) => (
                                    <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Color</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="col-span-3 justify-start">
                                    <div className="w-5 h-5 rounded-sm border mr-2" style={{backgroundColor: color}}/>
                                    {color}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 border-0">
                                 <HexColorPicker color={color} onChange={setColor} />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}

        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddService} disabled={!manualMode || isAnalyzing || !name}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Tile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
