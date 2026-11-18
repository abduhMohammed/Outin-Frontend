import Link from 'next/link';
import ProductCard, { type CardBadge } from '@/components/common/ProductCard';
import type { Product } from '@/types/api';

export function ProductSectionSkeleton() {
return (
    <section className="bg-white text-black py-14 md:py-20 px-6 md:px-12 border-t border-neutral-100">
    <div className="max-w-7xl mx-auto">
        <div className="h-7 w-40 bg-neutral-100 animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
            <div className="aspect-[3/4] w-full bg-neutral-100 animate-pulse" />
            <div className="h-3 w-16 bg-neutral-100 animate-pulse" />
            <div className="h-4 w-3/4 bg-neutral-100 animate-pulse" />
            </div>
        ))}
        </div>
    </div>
    </section>
);
}

export default function ProductSection({
title,
products,
badge,
desktopLimit = 4,
}: {
title: string;
products: Product[];
badge?: (index: number) => CardBadge | null;
desktopLimit?: number; // desktop shows one row; mobile can swipe through all
}) {
return (
    <section className="bg-white text-black py-14 md:py-20 px-6 md:px-12 border-t border-neutral-100">
    <div className="max-w-7xl mx-auto">
        {/* SECTION HEADER */}
        <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{title}</h2>
        <Link
            href="/shop"
            className="shrink-0 text-xs font-black uppercase tracking-wider text-black hover:text-[#FF4500] inline-flex items-center gap-1.5 transition-colors group"
        >
            View all
            <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </Link>
        </div>

        {/* MOBILE: swipeable row / DESKTOP: single-row grid */}
        <div className="-mx-6 px-6 md:mx-0 md:px-0 flex md:grid md:grid-cols-4 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product, index) => (
            <div
            key={product.id}
            className={`w-[46%] sm:w-[32%] shrink-0 snap-start md:w-auto ${
                index >= desktopLimit ? 'md:hidden' : ''
            }`}
            >
            <ProductCard product={product} badge={badge?.(index) ?? null} />
            </div>
        ))}
        </div>
    </div>
    </section>
);
}