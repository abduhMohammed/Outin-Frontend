'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getFacultyDrops } from '@/services/apiService';
import { FacultyDrop } from '@/types/api';

export default function FacultyDrops() {
const scrollContainerRef = useRef<HTMLDivElement>(null);
const [facultyDrops, setFacultyDrops] = useState<FacultyDrop[]>([]);
const [loading, setLoading] = useState(true);

// Fetch Data from .NET Web API
useEffect(() => {
async function fetchDrops() {
    try {
    const data = await getFacultyDrops();
    setFacultyDrops(data);
    } catch (err) {
    console.error("Error loading faculty drops:", err);
    } finally {
    setLoading(false);
    }
}
fetchDrops();
}, []);

const scroll = (direction: 'left' | 'right') => {
if (scrollContainerRef.current) {
    const { scrollLeft, clientWidth } = scrollContainerRef.current;
    const cardWidth = clientWidth < 640 ? clientWidth * 0.8 : clientWidth / 4;
    scrollContainerRef.current.scrollTo({
    left: direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth,
    behavior: 'smooth',
    });
}
};

const getIconTypeByName = (name: string) => {
const lower = name.toLowerCase();
if (lower.includes('med') || lower.includes('health')) return 'stethoscope';
if (lower.includes('pharm')) return 'bowl';
if (lower.includes('busin') || lower.includes('comm')) return 'briefcase';
return 'gear'; // Default icon for Engineering, Computer Science, etc.
};

const renderIcon = (type: string) => {
switch (type) {
    case 'gear':
    return (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 stroke-white fill-none stroke-[1.5]" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
    case 'stethoscope':
    return (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 stroke-white fill-none stroke-[1.5]" viewBox="0 0 24 24">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .2.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
        <circle cx="20" cy="10" r="2" />
        </svg>
    );
    case 'bowl':
    return (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 stroke-white fill-none stroke-[1.5]" viewBox="0 0 24 24">
        <path d="M12 3v6" />
        <path d="M6 9h12a6 6 0 0 1-6 6 6 6 0 0 1-6-6z" />
        <path d="M8 15v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3" />
        <path d="M9 21h6" />
        </svg>
    );
    case 'briefcase':
    return (
        <svg className="w-7 h-7 sm:w-8 sm:h-8 stroke-white fill-none stroke-[1.5]" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
    default:
    return null;
}
};

if (loading) {
return (
    <section className="bg-[#f5f5f5] py-16 text-center text-gray-500 font-bold uppercase tracking-widest text-xs">
    Loading Faculty Drops...
    </section>
);
}

return (
<section className="bg-[#f5f5f5] text-black py-12 sm:py-16 px-4 sm:px-6 md:px-12 border-t border-gray-200 overflow-hidden">
    <div className="max-w-7xl mx-auto">
    {/* HEADER & ARROWS */}
    <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight">
            FACULTY DROPS
        </h2>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
        <span className="hidden md:inline-block text-xs font-bold uppercase text-[#FF5A1F] tracking-wider">
            SHOP BY YOUR FACULTY
        </span>

        {/* CONTROLS ARROWS */}
        <div className="flex items-center gap-2">
            <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-sm font-bold active:scale-95"
            >
            &#8592;
            </button>
            <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-colors text-sm font-bold active:scale-95"
            >
            &#8594;
            </button>
        </div>
        </div>
    </div>

    {/* RESPONSIVE CAROUSEL CONTAINER */}
    <div
        ref={scrollContainerRef}
        className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 select-none"
        style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        }}
    >
        {facultyDrops.map((category) => {
        const iconType = getIconTypeByName(category.name);
        const imageSrc =
            category.imageUrl && category.imageUrl !== 'string'
            ? category.imageUrl
            : '/images/product/heavyweight-tee.jpg';

        return (
            <Link
            key={category.id}
            href={`/shop?faculty=${category.slug}`}
            className="group relative h-[320px] sm:h-[360px] md:h-[380px] 
                        w-[80vw] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-4.5rem)/4)] 
                        flex-shrink-0 rounded-lg overflow-hidden block shadow-md hover:shadow-xl transition-all duration-300 snap-start bg-black"
            >
            {/* BACKGROUND IMAGE */}
            <Image
                src={imageSrc}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center opacity-80 group-hover:scale-105 group-hover:opacity-95 transition-all duration-500"
            />

            {/* GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40 group-hover:from-black/95 transition-all duration-300" />

            {/* TOP ICON */}
            <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
                {renderIcon(iconType)}
            </div>

            {/* BOTTOM CONTENT */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10 flex items-end justify-between">
                <div>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                    {category.name}
                </h3>
                </div>

                {/* ARROW INDICATOR */}
                <span className="text-white text-lg sm:text-xl font-light transform group-hover:translate-x-1.5 transition-transform duration-300">
                &rarr;
                </span>
            </div>
            </Link>
        );
        })}
    </div>
    </div>
</section>
);
}