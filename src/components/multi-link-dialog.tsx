
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
             <Icon className="w-8 h-8" style={{ color: service.color }}/>
            <DialogTitle className="text-2xl">{name}</DialogTitle>
          </div>
        </DialogHeader>

        {/* Render links with categories */}
        {categories && categories.length > 0 && (
            <div className='space-y-4'>
                {categories.map((category) => (
                    <div key={category.name} className='space-y-2'>
                        <h4 className='font-semibold text-foreground'>{category.name}</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {category.links.map((link) => (
                                <Button
                                key={link.name}
                                asChild
                                variant="secondary"
                                className="justify-between h-12 text-base"
                                onClick={() => handleLinkClick(link.name)}
                                >
                                <Link
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <span>{link.name}</span>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
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
            <div className="grid grid-cols-2 gap-3 py-4">
            {links?.map((link) => (
                <Button
                key={link.name}
                asChild
                variant="secondary"
                className="justify-between h-12 text-base"
                onClick={() => handleLinkClick(link.name)}
                >
                <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span>{link.name}</span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
                </Button>
            ))}
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

    