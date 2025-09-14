
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
  name: string;
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
}

export function ServiceTile({ service, isEditMode, onDelete }: ServiceTileProps) {
  const { name, color, href, links, categories } = service;

  // Handle both string names and component types for icons
  let Icon: ElementType;
  const iconOrName = service.icon;

  if (typeof iconOrName === 'string' && LucideIcons[iconOrName as keyof typeof LucideIcons]) {
    Icon = LucideIcons[iconOrName as keyof typeof LucideIcons];
  } else if (typeof iconOrName === 'function' || (typeof iconOrName === 'object' && iconOrName && 'render' in iconOrName)) {
    // This handles React components passed directly (as functions or forwardRef objects)
    Icon = iconOrName as ElementType;
  } else {
    Icon = Globe; // Default icon
  }


  const handleLinkClick = () => {
    trackLinkClick(name, name); // For single links, service name is the link name
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault(); // Prevent the default browser context menu
      if (window.confirm(`Are you sure you want to delete the "${name}" tile?`)) {
        onDelete?.();
      }
    }
  };
  
  if (isEditMode) {
      return (
         <div 
            className="relative group h-full cursor-pointer rounded-lg p-1"
            onContextMenu={handleContextMenu}
            title={`Right-click to delete ${name}`}
          >
           <Card
                className="h-full border-2 border-dashed border-muted-foreground/50 opacity-70"
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
