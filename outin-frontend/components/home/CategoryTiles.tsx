'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCategories, getProducts } from '@/services/apiService';

interface Tile {
id: string;
name: string;
slug: string;
imageUrl: string;
}

// object-contain shows the whole picture. Switch to 'object-cover' to fill the card (crops the edges).
const IMAGE_FIT = 'object-contain p-2';

// Same width as a product card: 4 per row on desktop, swipeable on mobile
const TILE_WIDTH = 'w-[58%] sm:w-[38%] md:w-[calc((100%-3.75rem)/4)]';

export default function CategoryTiles() {
const [tiles, setTiles] = useState<Tile[]>([]);
const [isLoading, setIsLoading] = useState(true);
const sliderRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    let cancelled = false;

    async function load() {
    const [categories, products] = await Promise.all([getCategories(), getProducts()]);

    const result: Tile[] = [];
    for (const cat of categories) {
        const product = products.find(
        (p) => p.categoryName?.toLowerCase() === cat.name.toLowerCase()
        );
        if (!product) continue;
        result.push({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        imageUrl: product.thumbnailUrl,
        });
    }

    if (!cancelled) {
        setTiles(result);
        setIsLoading(false);
    }
    }

    load();
    return () => {
    cancelled = true;
    };
}, []);

const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = sliderRef.current.clientWidth * 0.75;
    sliderRef.current.scrollBy({
    left: direction === 'left' ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
    });
};

if (isLoading) {
    return (
    <section className="bg-[#FAFAFA] py-14 md:py-16 px-6 md:px-12 border-t border-neutral-200/70">
        <div className="max-w-7xl mx-auto">
        <div className="h-7 w-44 bg-neutral-200 animate-pulse mb-8" />
        <div className="flex gap-4 md:gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={`${TILE_WIDTH} shrink-0 space-y-3`}>
                <div className="aspect-[4/5] w-full bg-neutral-200/70 animate-pulse" />
                <div className="h-4 w-24 bg-neutral-200/70 animate-pulse" />
            </div>
            ))}
        </div>
        </div>
    </section>
    );
}

if (tiles.length === 0) return null;

return (
    <section className="bg-[#FAFAFA] text-black py-14 md:py-16 px-6 md:px-12 border-t border-neutral-200/70">
    <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER + MOBILE ARROWS */}
        <div className="flex items-end justify-between gap-4 mb-8">
        <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#FF4500]">
            03 // COLLECTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1">
            SHOP BY CATEGORY
            </h2>
        </div>

        {tiles.length > 1 && (
            <div className="flex md:hidden items-center gap-2">
            <button
                type="button"
                onClick={() => scrollSlider('left')}
                aria-label="Scroll categories left"
                className="w-9 h-9 bg-white border border-neutral-300 hover:border-black hover:bg-black hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
                &larr;
            </button>
            <button
                type="button"
                onClick={() => scrollSlider('right')}
                aria-label="Scroll categories right"
                className="w-9 h-9 bg-white border border-neutral-300 hover:border-black hover:bg-black hover:text-white flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
            >
                &rarr;
            </button>
            </div>
        )}
        </div>

        {/* MOBILE: swipeable row / DESKTOP: wrapping row of product-card-sized tiles */}
        <div
        ref={sliderRef}
        className="-mx-6 px-6 md:mx-0 md:px-0 flex md:flex-wrap gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
        {tiles.map((tile, idx) => (
            <Link
            key={tile.id}
            href={`/shop?category=${encodeURIComponent(tile.slug)}`}
            className={`group block shrink-0 snap-start ${TILE_WIDTH}`}
            >
            {/* IMAGE (whole picture visible) */}
            <div className="relative aspect-[4/5] w-full bg-white border border-neutral-200 group-hover:border-black/40 overflow-hidden transition-colors">
                <Image
                src={tile.imageUrl || '/images/product/Basic.jpg'}
                alt={tile.name}
                fill
                sizes="(max-width: 768px) 58vw, 25vw"
                className={`${IMAGE_FIT} group-hover:scale-105 transition-transform duration-500 ease-out`}
                />
                <span className="absolute top-2.5 left-3 text-[10px] font-mono font-bold tracking-widest text-neutral-400">
                0{idx + 1}
                </span>
            </div>

            {/* LABEL BELOW */}
            <div className="mt-3 flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight">
                {tile.name}
                </h3>
                <span className="w-7 h-7 border border-neutral-300 group-hover:bg-[#FF4500] group-hover:border-[#FF4500] group-hover:text-white flex items-center justify-center text-xs font-bold transition-colors">
                &rarr;
                </span>
            </div>
            </Link>
        ))}
        </div>
    </div>
    </section>
);
}