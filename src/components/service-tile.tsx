'use client';

import type { ElementType } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { MultiLinkDialog } from './multi-link-dialog';

interface ServiceLink {
  name: string;
  href: string;
}

export interface Service {
  name: string;
  icon: ElementType;
  color: string;
  href?: string;
  links?: ServiceLink[];
}

interface ServiceTileProps {
  service: Service;
}

export function ServiceTile({ service }: ServiceTileProps) {
  const { name, icon: Icon, color, href, links } = service;

  if (links && links.length > 0) {
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
    <Link href={href || '#'} {...linkProps} className="block group">
      <Card
        className="h-full transition-all duration-300 ease-in-out group-hover:transform group-hover:-translate-y-1 group-hover:shadow-xl border-transparent"
        style={{ backgroundColor: color }}
      >
        <CardContent className="flex flex-col items-center justify-center p-4 h-full text-white aspect-square">
           <Icon className="w-8 h-8 mb-2" />
           <p className="text-sm font-semibold text-center">{name}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
