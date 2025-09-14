
'use client';

import type { ElementType } from 'react';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MultiLinkDialog } from './multi-link-dialog';
import { trackLinkClick } from '@/lib/analytics';
import { Globe } from 'lucide-react';

interface ServiceLink {
  name: string;
  href: string;
}

interface ServiceCategory {
  name:string;
  links: ServiceLink[];
}

export interface Service {
  name: string;
  icon: keyof typeof LucideIcons | ElementType;
  color: string;
  href?: string;
  links?: ServiceLink[];
  categories?: ServiceCategory[];
}

interface ServiceTileProps {
  service: Service;
  isEditMode?: boolean;
  onDelete?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function ServiceTile({ service, isEditMode, onDelete, onDragStart, onDragEnd, onDragOver, onDrop }: ServiceTileProps) {
  const { name, color, href, links, categories } = service;

  let Icon: ElementType;
  if (typeof service.icon === 'string' && LucideIcons[service.icon as keyof typeof LucideIcons]) {
      Icon = LucideIcons[service.icon as keyof typeof LucideIcons];
  } else if (typeof service.icon === 'function' || (typeof service.icon === 'object' && 'render' in service.icon)) {
      Icon = service.icon;
  } else {
      Icon = Globe;
  }
  
  const handleLinkClick = () => {
    // For single links, service name is the link name
    trackLinkClick(name, name); 
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isEditMode) {
      // Prevent the default browser context menu
      e.preventDefault(); 
      if (window.confirm(`Are you sure you want to delete the "${name}" tile?`)) {
        onDelete?.();
      }
    }
  };
  
  if (isEditMode) {
      return (
         <div 
            className="relative group h-full cursor-move rounded-lg p-1 transition-all"
            onContextMenu={handleContextMenu}
            title={`Drag to reorder. Right-click to delete ${name}.`}
            draggable="true"
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
           <Card
                className="h-full border-2 border-dashed border-muted-foreground/50 opacity-70 pointer-events-none" // pointer-events-none on children
            >
                <CardContent className="flex flex-col items-center justify-center p-4 h-full text-foreground aspect-square">
                <Icon className="w-8 h-8 mb-2" style={{ color }} />
                <p className="text-sm font-semibold text-center" style={{ color }}>{name}</p>
                </CardContent>
            </Card>
        </div>
      )
  }

  if ((links && links.length > 0) || (categories && categories.length > 0)) {
    return (
      <MultiLinkDialog service={service}>
        <div className="block group cursor-pointer">
          <Card
            className="h-full transition-all duration-300 ease-in-out group-hover:transform group-hover:-translate-y-1 group-hover:shadow-xl border-transparent"
            style={{ backgroundColor: color }}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 h-full text-white aspect-square">
              <Icon className="w-8 h-8 mb-2" />
              <p className="text-sm font-semibold text-center">{name}</p>
            </CardContent>
          </Card>
        </div>
      </MultiLinkDialog>
    );
  }

  const isExternal = href?.startsWith('http');
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a href={href || '#'} {...linkProps} className="block group" onClick={handleLinkClick}>
      <Card
        className="h-full transition-all duration-300 ease-in-out group-hover:transform group-hover:-translate-y-1 group-hover:shadow-xl border-transparent"
        style={{ backgroundColor: color }}
      >
        <CardContent className="flex flex-col items-center justify-center p-4 h-full text-white aspect-square">
           <Icon className="w-8 h-8 mb-2" />
           <p className="text-sm font-semibold text-center">{name}</p>
        </CardContent>
      </Card>
    </a>
  );
}
