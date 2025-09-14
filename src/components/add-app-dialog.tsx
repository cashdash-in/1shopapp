
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
import { Loader2, Wand2, PlusCircle, Trash2 } from 'lucide-react';
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
  
  const [manualMode, setManualMode] = useState(true);
  const [links, setLinks] = useState([{ name: '', href: '' }]);

  const resetLocalState = () => {
    setUrl('');
    setIsAnalyzing(false);
    setAnalysisError('');
    setName('');
    setIcon('');
    setColor('#000000');
    setManualMode(true);
    setLinks([{ name: '', href: '' }]);
  }

  const handleAnalyzeUrl = async () => {
    if (!url || !url.startsWith('http://') && !url.startsWith('https://')) {
      setAnalysisError('Please enter a full and valid URL (e.g., https://example.com).');
      return;
    }
    setAnalysisError('');
    setIsAnalyzing(true);
    setManualMode(true);

    try {
      new URL(url); // Validate URL format
      const metadata = await generateTileMetadata({ url });
      
      setName(metadata.name);
      setIcon(metadata.icon);
      setColor(metadata.color);
      // Set the first link with the analyzed data
      setLinks([{ name: metadata.name, href: url }]);

    } catch (err) {
      console.error(err);
      setAnalysisError("AI analysis failed. Please fill in the details manually.");
       setLinks([{ name: '', href: url }]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLinkChange = (index: number, field: 'name' | 'href', value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const addLink = () => {
    setLinks([...links, { name: '', href: '' }]);
  };

  const removeLink = (index: number) => {
    if (links.length > 1) {
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks);
    }
  };

  const handleAddService = () => {
    const filledLinks = links.filter(link => link.name.trim() !== '' && link.href.trim() !== '');

    if (!name || !icon || !color || filledLinks.length === 0) {
        setAnalysisError("Please fill out the Name, Icon, Color, and at least one full Link Name and Link URL.");
        return;
    }
    
     const newService: Service = {
        name,
        icon: icon as any,
        color,
        links: filledLinks,
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a New App or Website</DialogTitle>
          <DialogDescription>
            Enter a URL to get AI suggestions, then add one or more links for this tile.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-4">
            {/* URL Input for AI */}
            <div className="space-y-2">
                <Label htmlFor="url">Analyze URL (Optional)</Label>
                <div className="flex items-center gap-2">
                    <Input
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        disabled={isAnalyzing}
                    />
                    <Button onClick={handleAnalyzeUrl} disabled={isAnalyzing || !url} size="icon" variant="outline">
                        {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                        <span className="sr-only">Analyze</span>
                    </Button>
                </div>
            </div>


            {/* Manual Entry Fields */}
            {manualMode && (
                <div className="space-y-4 pt-4 border-t">
                    <p className={cn("text-sm text-center", analysisError ? "text-destructive" : "text-muted-foreground")}>
                        {analysisError || "Fill in the details for your new custom tile."}
                    </p>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Tile Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" placeholder="e.g., My Work Tools"/>
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

                    <div className='pt-4 border-t'>
                        <Label>Links for this Tile</Label>
                    </div>

                    {links.map((link, index) => (
                        <div key={index} className="space-y-3 p-3 border rounded-md relative">
                            {links.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6"
                                    onClick={() => removeLink(index)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`link-name-${index}`} className="text-right text-xs">Name</Label>
                                <Input
                                    id={`link-name-${index}`}
                                    value={link.name}
                                    onChange={(e) => handleLinkChange(index, 'name', e.target.value)}
                                    className="col-span-3 h-8"
                                    placeholder="e.g., Google Drive"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor={`link-href-${index}`} className="text-right text-xs">URL</Label>
                                <Input
                                    id={`link-href-${index}`}
                                    value={link.href}
                                    onChange={(e) => handleLinkChange(index, 'href', e.target.value)}
                                    className="col-span-3 h-8"
                                    placeholder="https://drive.google.com"
                                />
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" size="sm" onClick={addLink}>Add another link</Button>

                </div>
            )}

        </div>

        <DialogFooter className="border-t pt-4">
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
