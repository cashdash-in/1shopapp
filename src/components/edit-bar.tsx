
'use client';

import React from 'react';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import { AddAppDialog } from './add-app-dialog';
import type { Service } from './service-tile';

interface EditBarProps {
  isVisible: boolean;
  onAddService: (service: Service) => void;
}

export function EditBar({ isVisible, onAddService }: EditBarProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-t p-4">
      <div className="container mx-auto flex justify-center items-center gap-4">
        <AddAppDialog onAddService={onAddService}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New App
          </Button>
        </AddAppDialog>
      </div>
    </div>
  );
}
