
'use client';

import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import type { Service } from './service-tile';
import { ArrowUpRight } from 'lucide-react';
import { trackLinkClick } from '@/lib/analytics';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';


interface MultiLinkDialogProps {
  service: Service;
  children: React.ReactNode;
}

export function MultiLinkDialog({ service, children }: MultiLinkDialogProps) {
  const { name, links, categories, icon: Icon } = service;

  const handleLinkClick = (linkName: string) => {
    trackLinkClick(name, linkName);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md rounded-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4 pr-12">
              <Icon className="w-8 h-8"/>
              <DialogTitle className="text-2xl">{name}</DialogTitle>
          </div>
        </DialogHeader>
        <a href="/" className="absolute top-14 right-4 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold cursor-pointer z-50 flex-shrink-0">
            1
        </a>
        {/* Render links with categories */}
        {categories && categories.length > 0 && (
            <div className={cn(
                'flex flex-col gap-4', // Default vertical layout
                name === 'Shopping' && 'md:flex-row md:flex-wrap md:gap-x-8 md:gap-y-4' // Horizontal for Shopping on medium screens and up
            )}>
                {categories.map((category) => (
                    <div key={category.name} className='space-y-2 flex-shrink-0'>
                        <h4 className='font-semibold '>{category.name}</h4>
                        <div className="flex flex-col gap-2">
                            {category.links.map((link) => (
                                <Button
                                key={link.name}
                                asChild
                                variant="secondary"
                                className="justify-between h-auto min-h-10 text-base whitespace-normal"
                                onClick={() => handleLinkClick(link.name)}
                                >
                                <Link
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span className="flex-1 text-left">{link.name}</span>
                                    <ArrowUpRight className="h-4 w-4 ml-2" />
                                </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Render links without categories */}
        {links && links.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-4">
            {links?.map((link) => (
                <Button
                key={link.name}
                asChild
                variant="secondary"
                className="justify-between h-auto min-h-12 text-base whitespace-normal"
                onClick={() => handleLinkClick(link.name)}
                >
                <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className='flex-1 text-left'>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
                </Button>
            ))}
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
