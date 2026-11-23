import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts, getCategories, getColors, getSizes } from '@/services/apiService';
import ShopClient from './ShopClient';

export const revalidate = 300;

export const metadata: Metadata = {
title: 'Shop | OUTIN',
description: 'Browse all OUTIN streetwear: hoodies, sweatpants, t-shirts and more.',
};

export default async function ShopPage() {
const [products, categories, colors, sizes] = await Promise.all([
    getProducts(),
    getCategories(),
    getColors(),
    getSizes(),
]);

return (
    <Suspense
    fallback={
        <div className="min-h-screen bg-[#F9F9F9] p-12 text-center text-xs font-bold">
        Loading Shop...
        </div>
    }
    >
    <ShopClient products={products} categories={categories} colors={colors} sizes={sizes} />
    </Suspense>
);
}