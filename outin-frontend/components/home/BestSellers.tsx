'use client';

import { useState, useEffect } from 'react';
import { getBestSellers } from '@/services/apiService';
import type { Product } from '@/types/api';
import ProductSection, { ProductSectionSkeleton } from '@/components/home/ProductSection';

export default function BestSellers() {
const [products, setProducts] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
    let cancelled = false;
    getBestSellers(8).then((data) => {
    if (!cancelled) {
        setProducts(Array.isArray(data) ? data : []);
        setIsLoading(false);
    }
    });
    return () => {
    cancelled = true;
    };
}, []);

if (isLoading) return <ProductSectionSkeleton />;
if (products.length === 0) return null;

return (
    <ProductSection
    title="BEST SELLERS"
    products={products}
    badge={(i) => (i < 3 ? { label: `#${i + 1} Best Seller`, variant: 'accent' } : null)}
    />
);
}