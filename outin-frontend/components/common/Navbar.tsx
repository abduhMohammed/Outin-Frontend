'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getPendingOrder } from '@/lib/pendingOrder';

export default function Navbar() {
const [hasBanner, setHasBanner] = useState(false);
const pathname = usePathname();

const checkBanner = useCallback(() => {
    const order = getPendingOrder();
    const shouldShow = order && !pathname.startsWith('/order-success') && !pathname.startsWith('/admin');
    setHasBanner(!!shouldShow);
}, [pathname]);

useEffect(() => {
    checkBanner();

    // Listen for storage changes or custom events when banner is closed
    window.addEventListener('storage', checkBanner);
    const interval = setInterval(checkBanner, 500); // Polling to catch banner state changes instantly

    return () => {
    window.removeEventListener('storage', checkBanner);
    clearInterval(interval);
    };
}, [checkBanner]);

return (
    <header className={`fixed left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${hasBanner ? 'top-[41px] sm:top-[33px]' : 'top-0'}`}>
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase text-white">
        OUT<span className="text-orange-600">IN</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-gray-300">
        <Link href="/shop" className="hover:text-orange-600 transition-colors">
            Shop
        </Link>
        <Link href="/#faculty-drops" className="hover:text-orange-600 transition-colors">
            Faculty Drops
        </Link>
        <Link href="/#about" className="hover:text-orange-600 transition-colors">
            About
        </Link>
        </nav>

        {/* ACTIONS / ICONS */}
        <div className="flex items-center gap-5 text-white">
        {/* Search Icon */}
        <Link href="/search" className="hover:text-orange-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
        </Link>

        {/* Profile Icon */}
        <Link href="/login" className="hover:text-orange-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
            </svg>
        </Link>

        {/* Cart Icon */}
        <Link href="/cart" className="relative hover:text-orange-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        </Link>
        </div>
    </div>
    </header>
);
}