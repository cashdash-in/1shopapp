
'use client';

import Link from 'next/link';
import { ServiceTile } from '@/components/service-tile';
import type { Service } from '@/components/service-tile';
import { FeedbackDialog } from '@/components/feedback-dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import React, { useState, useEffect } from 'react';
import { trackPWAInstall } from '@/lib/analytics';
import { services as defaultServices } from '@/lib/default-services';
import { Download, Search as SearchIcon, Pencil, Home as HomeIcon } from 'lucide-react';
import { EditBar } from '@/components/edit-bar';


// Define the type for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

export default function Home() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [editMode, setEditMode] = useState(false);
    const [draggedService, setDraggedService] = useState<Service | null>(null);


    useEffect(() => {
        // Load services from localStorage or use defaults
        try {
            const storedServices = localStorage.getItem('userServices');
            if (storedServices) {
                setServices(JSON.parse(storedServices));
            } else {
                setServices(defaultServices);
                localStorage.setItem('userServices', JSON.stringify(defaultServices));
            }
        } catch (error) {
            console.error("Failed to parse services from localStorage", error);
            setServices(defaultServices);
        }

        // Check for the admin flag in localStorage
        if (typeof window !== 'undefined') {
            const adminFlag = localStorage.getItem('isAdmin');
            setIsAdmin(adminFlag === 'true');
        }

        // Handle PWA installation prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };

    }, []);

    // Persist changes to localStorage whenever services state is updated
    useEffect(() => {
        // Don't save the initial empty array
        if (services.length > 0) {
            localStorage.setItem('userServices', JSON.stringify(services));
        }
    }, [services]);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const query = formData.get('search') as string;
        if (query) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleInstallClick = () => {
        if (!installPrompt) return;
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                trackPWAInstall();
            }
        });
    };

    const addService = (newService: Service) => {
        setServices(prevServices => [...prevServices, newService]);
    };

    const updateService = (updatedService: Service, originalName: string) => {
        setServices(prevServices => prevServices.map(s => s.name === originalName ? updatedService : s));
    }

    const deleteService = (serviceNameToDelete: string) => {
        setServices(prevServices => prevServices.filter(s => s.name !== serviceNameToDelete));
    };

    // --- Drag and Drop Handlers ---
    const handleDragStart = (e: React.DragEvent, service: Service) => {
        setDraggedService(service);
        // Make the dragged element semi-transparent
        e.currentTarget.classList.add('opacity-50');
    };

    const handleDragEnd = (e: React.DragEvent) => {
        // Clean up styles and state
        e.currentTarget.classList.remove('opacity-50');
        setDraggedService(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        // This is necessary to allow a drop
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetService: Service) => {
        e.preventDefault();
        if (!draggedService || draggedService.name === targetService.name) {
            return; // No drop if it's the same tile or no tile is being dragged
        }

        const fromIndex = services.findIndex(s => s.name === draggedService.name);
        const toIndex = services.findIndex(s => s.name === targetService.name);
        
        if (fromIndex !== -1 && toIndex !== -1) {
            const newServices = [...services];
            // Remove the dragged service from its original position
            const [movedService] = newServices.splice(fromIndex, 1);
            // Insert it at the new position
            newServices.splice(toIndex, 0, movedService);
            setServices(newServices);
        }
    };

  return (
    <>
      <main className="min-h-screen bg-background flex flex-col p-4">
        <div className="flex-shrink-0 text-center w-full max-w-2xl mx-auto pt-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-2">
            1ShopApp
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground whitespace-normal">
            Access all your essential apps in one place and Save Space.
          </p>
           <form onSubmit={handleSearch} className="mt-6 w-full relative">
                <Input
                    name="search"
                    id="search"
                    placeholder="Search for your Favourite App or Website"
                    className="h-12 text-lg pl-4 pr-12 rounded-full shadow-md border-primary/20"
                />
                <Button type="submit" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full w-9 h-9">
                    <SearchIcon className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
            </form>
        </div>

        <div className="flex-grow w-full max-w-5xl mx-auto flex items-center justify-center py-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {services.map((service) => (
              <ServiceTile
                key={service.name}
                service={service}
                isEditMode={editMode}
                onDelete={() => deleteService(service.name)}
                onDragStart={(e) => handleDragStart(e, service)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, service)}
              />
            ))}
          </div>
        </div>
        <footer className="flex-shrink-0 text-center max-w-4xl mx-auto px-4 space-y-2 pb-4">
            <div className="flex justify-center items-center gap-2 md:gap-4 flex-wrap">
               <Link href="/about" className="text-xs text-muted-foreground hover:text-foreground underline">
                  About Us
              </Link>
              <Link href="/partner" className="text-xs text-muted-foreground hover:text-foreground underline">
                  Partner with us
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground underline">
                  Terms & Conditions
              </Link>
               <FeedbackDialog>
                    <Button variant="link" className="text-xs text-muted-foreground hover:text-foreground underline p-0 h-auto">Feedback</Button>
               </FeedbackDialog>
                <Button variant="outline" size="sm" onClick={() => setEditMode(prev => !prev)}>
                    <Pencil className="w-3 h-3 mr-1"/> {editMode ? 'Done' : 'Customize'}
                </Button>
               {installPrompt && !editMode && (
                 <Button variant="link" className="text-xs text-muted-foreground hover:text-foreground underline p-0 h-auto" onClick={handleInstallClick}>
                    <Download className="w-3 h-3 mr-1"/> Install App
                </Button>
               )}
              {isAdmin && !editMode && (
                <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground underline">
                    Admin
                </Link>
              )}
            </div>
             <div className="text-[10px] text-muted-foreground/80 pt-2 space-y-1">
                <p>
                    <span className="font-bold">Disclaimer:</span> 1ShopApp is an independent platform and your gateway to other websites. We do not collect any personal data. All trademarks and logos are the property of their respective owners. Use of this service is at your own discretion. Some links help support 1ShopApp when used—at no extra cost to you.
                </p>
                 <p className="font-semibold">Powered by Snazzify.co.in</p>
             </div>
        </footer>
      </main>
      <EditBar 
        isVisible={editMode} 
        services={services}
        onAddService={addService} 
        onUpdateService={updateService} 
      />
    </>
  );
}
