import type { ElementType } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface ServiceTileProps {
  name: string;
  icon: ElementType;
  color: string;
  href: string;
}

export function ServiceTile({ name, icon: Icon, color, href }: ServiceTileProps) {
  const isExternal = href.startsWith('http');
  const linkProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Link href={href} {...linkProps} className="block group">
      <Card
        className="h-full transition-all duration-300 ease-in-out group-hover:transform group-hover:-translate-y-2 group-hover:shadow-2xl border-transparent"
        style={{ backgroundColor: color }}
      >
        <CardContent className="flex flex-col items-center justify-center p-6 h-full text-white aspect-square">
          <Icon className="w-10 h-10 sm:w-12 sm:h-12 mb-4" />
          <p className="text-base sm:text-lg font-semibold text-center">{name}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
