import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/api';

export type CardBadge = { label: string; variant?: 'dark' | 'accent' };

export default function ProductCard({
product,
badge,
sizes = '(max-width: 768px) 46vw, 25vw',
}: {
product: Product;
badge?: CardBadge | null;
sizes?: string;
}) {
const soldOut = product.status === 'OutOfStock';
const price = product.minPrice ?? 0;

return (
    <Link href={`/shop/${product.slug}`} className="group block w-full">
    <div className="relative aspect-[3/4] w-full bg-[#F8F8F8] overflow-hidden mb-3">
        {badge && (
        <span
            className={`absolute top-3 left-3 z-10 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-2 py-0.5 ${
            badge.variant === 'accent' ? 'bg-[#FF4500]' : 'bg-black'
            }`}
        >
            {badge.label}
        </span>
        )}

        {soldOut && (
        <span className="absolute top-3 right-3 z-10 bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
            Sold Out
        </span>
        )}

        <Image
        src={product.thumbnailUrl || '/images/product/Basic.jpg'}
        alt={product.name}
        fill
        sizes={sizes}
        className={`object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out ${
            soldOut ? 'opacity-50' : ''
        }`}
        />
    </div>

    <div className="space-y-1">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
        {product.categoryName || 'OUTIN'}
        </p>
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-black group-hover:text-[#FF4500] transition-colors line-clamp-1">
        {product.name}
        </h3>
        <p className="text-xs sm:text-sm font-extrabold text-black pt-0.5">
        EGP {price.toLocaleString()}
        </p>
    </div>
    </Link>
);
}