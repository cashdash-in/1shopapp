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

interface MultiLinkDialogProps {
  service: Service;
  children: React.ReactNode;
}

export function MultiLinkDialog({ service, children }: MultiLinkDialogProps) {
  const { name, links, icon: Icon } = service;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
             <Icon className="w-8 h-8" style={{ color: service.color }}/>
            <DialogTitle className="text-2xl">{name}</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {links?.map((link) => (
            <Button
              key={link.name}
              asChild
              variant="secondary"
              className="justify-between h-12 text-base"
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
      </DialogContent>
    </Dialog>
  );
}
