
'use client';

import React from 'react';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { AddAppDialog } from './add-app-dialog';
import type { Service } from './service-tile';

interface EditBarProps {
  isVisible: boolean;
  services: Service[];
  onAddService: (service: Service) => void;
  onUpdateService: (service: Service, originalName: string) => void;
}

export function EditBar({ isVisible, services, onAddService, onUpdateService }: EditBarProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t p-4">
      <div className="container mx-auto flex justify-center items-center gap-4">
        <AddAppDialog 
            services={services}
            onAddService={onAddService} 
            onUpdateService={onUpdateService}
        >
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add or Edit App
          </Button>
        </AddAppDialog>
      </div>
    </div>
  );
}
