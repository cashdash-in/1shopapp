
'use client';

import type { ElementType } from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { MultiLinkDialog } from './multi-link-dialog';
import { trackLinkClick } from '@/lib/analytics';
import { Globe, X } from 'lucide-react';
import { Button } from './ui/button';

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
  if (typeof service.icon === 'string' && LucideIcons[service.icon as keyof typeof LucideIcons]) {
      Icon = LucideIcons[service.icon as keyof typeof LucideIcons] as ElementType;
  } else if (typeof service.icon === 'function') {
      Icon = service.icon;
  } else {
      Icon = Globe; // Default icon if not found
  }

  const handleLinkClick = () => {
    trackLinkClick(name, name); // For single links, service name is the link name
  }
  
  if (isEditMode) {
      return (
         <div className="relative group">
             <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full z-10"
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    onDelete?.();
                }}
             >
                <X className="w-4 h-4"/>
                <span className="sr-only">Delete {name}</span>
             </Button>
            <Card
                className="h-full border-dashed border-2"
                style={{ backgroundColor: `${color}80` }} // 50% opacity
            >
                <CardContent className="flex flex-col items-center justify-center p-4 h-full text-white aspect-square">
                <Icon className="w-8 h-8 mb-2" />
                <p className="text-sm font-semibold text-center">{name}</p>
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
