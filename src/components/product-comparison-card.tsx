'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/ai/flows/compare-products-flow';

interface ProductComparisonCardProps {
  product: Product;
}

export function ProductComparisonCard({ product }: ProductComparisonCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 relative h-48 md:h-auto bg-muted">
           <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            data-ai-hint="product image"
          />
        </div>
        <div className="md:w-2/3">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">{product.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.prices.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold">{item.retailer}</p>
                      <p className="text-lg font-bold text-foreground">₹{item.price}</p>
                    </div>
                    <Button asChild>
                      <Link href={item.url} target="_blank" rel="noopener noreferrer">
                        Go to Store
                      </Link>
                    </Button>
                  </div>
                  {index < product.prices.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
