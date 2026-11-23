'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, Category, Color, Size } from '@/types/api';

const ITEMS_PER_PAGE = 6;

export default function ShopClient({
products,
categories,
colors,
sizes,
}: {
products: Product[];
categories: Category[];
colors: Color[];
sizes: Size[];
}) {
const searchParams = useSearchParams();

const [sortBy, setSortBy] = useState<string>('Newest');
const [selectedTab, setSelectedTab] = useState<string>('ALL');
const [searchQuery, setSearchQuery] = useState<string>('');
const [selectedSize, setSelectedSize] = useState<string>('');
const [selectedColor, setSelectedColor] = useState<string>('');
const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
const [currentPage, setCurrentPage] = useState<number>(1);

// ?search=<text> -> filter by name/category (a new search without ?category resets the tab)
useEffect(() => {
    setSearchQuery(searchParams.get('search')?.trim() ?? '');
    if (!searchParams.get('category')) setSelectedTab('ALL');
    setCurrentPage(1);
}, [searchParams]);

// ?category=<slug or name> -> select the matching tab (tabs use the category name)
useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (!categoryParam || categories.length === 0) return;

    const wanted = categoryParam.toLowerCase().trim();
    const match = categories.find(
    (c) => c.slug?.toLowerCase() === wanted || c.name.toLowerCase() === wanted
    );

    if (match) {
    setSelectedTab(match.name.toUpperCase());
    setCurrentPage(1);
    }
}, [searchParams, categories]);

const topTabs = ['ALL', ...categories.map((c) => c.name.toUpperCase())];

const q = searchQuery.toLowerCase();

const filtered = products.filter((prod) => {
    const matchesTab =
    selectedTab === 'ALL' ||
    (prod.categoryName && prod.categoryName.toUpperCase() === selectedTab);

    const matchesSearch =
    !q ||
    prod.name.toLowerCase().includes(q) ||
    (prod.categoryName ?? '').toLowerCase().includes(q);

    return matchesTab && matchesSearch;
});

const filteredProducts = [...filtered].sort((a, b) => {
    const priceA = (a as any).basePrice ?? a.minPrice ?? 0;
    const priceB = (b as any).basePrice ?? b.minPrice ?? 0;

    if (sortBy === 'Price: Low to High') return priceA - priceB;
    if (sortBy === 'Price: High to Low') return priceB - priceA;
    if (sortBy === 'Newest') return (b.id ?? '').localeCompare(a.id ?? '');
    return 0;
});

const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

return (
    <div className="min-h-screen bg-[#F9F9F9] text-black font-sans">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-6 md:pt-8 pb-4">
        <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-widest font-bold mb-2">
        <Link href="/" className="hover:text-black transition-colors">
            HOME
        </Link>{' '}
        / <span className="text-neutral-700">SHOP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight">
        SHOP OUTIN
        </h1>
        {searchQuery && (
        <p className="mt-2 text-xs font-bold text-neutral-500">
            Results for &ldquo;{searchQuery}&rdquo;
            <Link href="/shop" className="text-orange-600 hover:underline ml-3">
            Clear
            </Link>
        </p>
        )}
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 mb-6">
        <div className="flex items-center gap-1 border border-neutral-200 bg-white p-1 rounded-sm overflow-x-auto no-scrollbar max-w-full">
        {topTabs.map((tab) => (
            <button
            key={tab}
            onClick={() => {
                setSelectedTab(tab);
                setCurrentPage(1);
            }}
            className={`px-4 sm:px-6 py-2 text-[11px] sm:text-xs font-black tracking-wider transition-all uppercase whitespace-nowrap cursor-pointer ${
                selectedTab === tab
                ? 'bg-black text-white'
                : 'bg-transparent text-neutral-600 hover:text-black'
            }`}
            >
            {tab}
            </button>
        ))}
        </div>
    </div>

    <div className="lg:hidden max-w-7xl mx-auto px-4 mb-6 flex justify-between items-center">
        <button
        onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        className="flex items-center gap-2 bg-black text-white text-xs font-bold px-4 py-2.5 uppercase tracking-wider rounded-sm cursor-pointer"
        >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 00-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {isMobileFilterOpen ? 'Close Filters' : 'Filter & Sort'}
        </button>
        <span className="text-xs font-bold text-neutral-500">
        {filteredProducts.length} ITEMS
        </span>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div
            className={`space-y-6 lg:space-y-8 pr-2 ${
            isMobileFilterOpen
                ? 'block bg-white p-5 border border-neutral-200 rounded-sm mb-6'
                : 'hidden lg:block'
            }`}
        >
            <div className="hidden lg:flex items-center gap-2 border-b border-neutral-200 pb-3">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 00-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-xs font-black uppercase tracking-wider">FILTER</span>
            </div>

            <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800">
                COLOR
            </h3>
            <div className="flex flex-wrap gap-2 max-w-[200px]">
                {colors.map((c) => (
                <button
                    key={c.id}
                    onClick={() => setSelectedColor(selectedColor === c.id ? '' : c.id)}
                    style={{ backgroundColor: c.hexCode || c.name.toLowerCase() }}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border border-neutral-300 transition-transform cursor-pointer ${
                    selectedColor === c.id
                        ? 'scale-110 ring-2 ring-orange-600 ring-offset-2'
                        : ''
                    }`}
                />
                ))}
            </div>
            </div>

            <div className="space-y-3 border-t border-neutral-200 pt-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800">
                SIZE
            </h3>
            <div className="grid grid-cols-5 lg:grid-cols-3 gap-1.5 max-w-[220px]">
                {sizes.map((s) => (
                <button
                    key={s.id}
                    onClick={() => setSelectedSize(selectedSize === s.id ? '' : s.id)}
                    className={`py-2 text-[11px] font-bold border transition-all cursor-pointer ${
                    selectedSize === s.id
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-black'
                    }`}
                >
                    {s.name}
                </button>
                ))}
            </div>
            </div>

            <div className="space-y-3 border-t border-neutral-200 pt-6">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800">
                SORT BY
            </h3>
            <select
                value={sortBy}
                onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
                }}
                className="w-full bg-white border border-neutral-200 text-xs font-bold p-2 rounded-none outline-none focus:border-black cursor-pointer"
            >
                <option value="Newest">Newest</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
            </select>
            </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
            <div className="hidden lg:flex justify-between items-center text-xs font-bold text-neutral-500 border-b border-neutral-200 pb-3">
            <span>
                SHOWING {filteredProducts.length > 0 ? startIndex + 1 : 0}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)} OF {filteredProducts.length} PRODUCTS
            </span>
            <div className="flex items-center gap-1">
                <span className="uppercase">SORT BY: {sortBy}</span>
            </div>
            </div>

            {currentProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
                {currentProducts.map((prod) => {
                const mainImage = prod.thumbnailUrl || '/images/product/Basic.jpg';
                const basePrice = (prod as any).basePrice ?? prod.minPrice ?? 0;
                const soldOut = prod.status === 'OutOfStock';

                return (
                    <Link
                    key={prod.id}
                    href={`/shop/${prod.slug}`}
                    className="group bg-white p-2 sm:p-3 border border-neutral-100 hover:border-neutral-300 transition-all flex flex-col justify-between"
                    >
                    <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden mb-3">
                        <Image
                        src={mainImage}
                        alt={prod.name}
                        fill
                        className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
                            soldOut ? 'opacity-50' : ''
                        }`}
                        />
                        {soldOut && (
                        <span className="absolute left-2 top-2 bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-1">
                            Sold Out
                        </span>
                        )}
                    </div>

                    <div className="space-y-1">
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-800 block">
                        OUTIN
                        </span>
                        <h2 className="text-[11px] sm:text-xs font-bold text-neutral-600 group-hover:text-black transition-colors line-clamp-1">
                        {prod.name}
                        </h2>
                        <p className="text-[11px] sm:text-xs font-black text-black pt-0.5">
                        EGP {basePrice}
                        </p>
                    </div>
                    </Link>
                );
                })}
            </div>
            ) : (
            <div className="text-center py-16 bg-white border border-neutral-200">
                <p className="text-sm font-bold text-neutral-500">No products found for this filter.</p>
            </div>
            )}

            {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 sm:gap-2 pt-8 sm:pt-12 text-xs font-bold">
                <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-neutral-600 hover:text-black disabled:text-neutral-300 disabled:cursor-not-allowed cursor-pointer"
                >
                &lt;
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                const pageNum = index + 1;
                return (
                    <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-black text-xs transition-colors cursor-pointer ${
                        currentPage === pageNum
                        ? 'bg-orange-600 text-white'
                        : 'bg-white hover:bg-neutral-200 text-black border border-neutral-200'
                    }`}
                    >
                    {pageNum}
                    </button>
                );
                })}

                <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 text-neutral-600 hover:text-black disabled:text-neutral-300 disabled:cursor-not-allowed cursor-pointer"
                >
                &gt;
                </button>
            </div>
            )}
        </div>
        </div>
    </div>
    </div>
);
}