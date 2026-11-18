'use client';

import { useState, useEffect } from 'react';
import { getLatestDropProducts } from '@/services/apiService';
import type { Product } from '@/types/api';
import ProductSection, { ProductSectionSkeleton } from '@/components/home/ProductSection';

export default function LatestDrop() {
const [products, setProducts] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);

useEffect(() => {
    let cancelled = false;
    getLatestDropProducts().then((data) => {
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
    title="LATEST DROP"
    products={products}
    badge={() => ({ label: 'NEW', variant: 'dark' })}
    />
);
}