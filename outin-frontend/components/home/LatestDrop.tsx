'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getLatestDropProducts } from '@/services/apiService';

export default function LatestDrop() {
const [products, setProducts] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState<boolean>(true);

useEffect(() => {
async function loadLatestDrops() {
    const data = await getLatestDropProducts();
    setProducts(data);
    setIsLoading(false);
}

loadLatestDrops();
}, []);

if (isLoading) {
return (
    <section className="bg-[#f5f5f5] text-black py-16 px-6 md:px-12">
    <div className="max-w-7xl mx-auto text-center">
        <p className="text-xs font-bold text-neutral-400 animate-pulse">Loading Latest Drops...</p>
    </div>
    </section>
);
}

if (products.length === 0) {
return null;
}

return (
<section className="bg-[#f5f5f5] text-black py-16 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
    <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight">
        LATEST DROP
        </h2>
        <Link
        href="/shop"
        className="text-xs font-bold uppercase text-orange-600 hover:text-orange-700 flex items-center gap-1 tracking-wider transition-colors"
        >
        VIEW ALL PRODUCTS &rarr;
        </Link>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
        <Link
            key={product.id}
            href={`/shop/${product.id}`}
            className="group block w-full bg-white p-3 rounded-sm shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="relative aspect-square w-full bg-white overflow-hidden mb-3">
            <Image
                src={product.thumbnailUrl || '/images/placeholder.png'}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
            </div>

            <div className="space-y-1 pt-1">
            <p className="text-xs font-black uppercase tracking-wider text-black">
                {product.categoryName || 'OUTIN'}
            </p>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-tight">
                {product.name}
            </p>
            <p className="text-xs font-extrabold text-black pt-0.5">
                EGP {product.minPrice}
            </p>
            </div>
        </Link>
        ))}
    </div>
    </div>
</section>
);
}