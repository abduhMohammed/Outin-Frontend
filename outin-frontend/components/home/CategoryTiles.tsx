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

// Full class names so Tailwind can see them: columns follow the number of categories
const DESKTOP_COLS: Record<number, string> = {
1: 'md:grid-cols-1',
2: 'md:grid-cols-2',
3: 'md:grid-cols-3',
};

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
    <section className="bg-[#FAFAFA] py-14 md:py-20 px-6 md:px-12 border-t border-neutral-200/70">
        <div className="max-w-7xl mx-auto">
        <div className="h-7 w-44 bg-neutral-200 animate-pulse mb-8" />
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
            <div
                key={i}
                className="w-[74%] sm:w-[46%] md:w-auto shrink-0 aspect-[3/4] bg-neutral-200/70 animate-pulse"
            />
            ))}
        </div>
        </div>
    </section>
    );
}

if (tiles.length === 0) return null;

const desktopCols = DESKTOP_COLS[tiles.length] ?? 'md:grid-cols-4';
// fewer, wider tiles look better a bit shorter
const tileAspect = tiles.length <= 3 ? 'aspect-[3/4] md:aspect-[4/5]' : 'aspect-[3/4]';

return (
    <section className="bg-[#FAFAFA] text-black py-14 md:py-20 px-6 md:px-12 border-t border-neutral-200/70">
    <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER + MOBILE ARROWS */}
        <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
            SHOP BY CATEGORY
        </h2>

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

        {/* MOBILE HORIZONTAL CAROUSEL / DESKTOP GRID */}
        <div
        ref={sliderRef}
        className={`-mx-6 px-6 md:mx-0 md:px-0 flex md:grid ${desktopCols} gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        >
        {tiles.map((tile, idx) => (
            <Link
            key={tile.id}
            href={`/shop?category=${encodeURIComponent(tile.slug)}`}
            className={`group relative block w-[74%] sm:w-[46%] md:w-auto shrink-0 snap-start overflow-hidden bg-neutral-900 ${tileAspect}`}
            >
            <Image
                src={tile.imageUrl || '/images/product/Basic.jpg'}
                alt={tile.name}
                fill
                sizes="(max-width: 768px) 74vw, 33vw"
                className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
            />

            {/* DARK GRADIENT OVERLAY FOR CLEAN CONTRAST */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

            {/* TOP INDEX TAG */}
            <span className="absolute top-3 left-3 text-[10px] font-mono font-bold tracking-widest text-white/70">
                0{idx + 1}
            </span>

            {/* BOTTOM CATEGORY LABEL */}
            <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-center justify-between text-white">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">
                {tile.name}
                </h3>
                <span className="w-8 h-8 bg-white/10 group-hover:bg-[#FF4500] text-white flex items-center justify-center text-sm font-bold transition-colors">
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