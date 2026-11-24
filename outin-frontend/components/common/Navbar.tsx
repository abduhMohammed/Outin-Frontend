'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getPendingOrder } from '@/lib/pendingOrder';
import { useCart } from '@/lib/useCartStore';
import SearchOverlay from '@/components/common/SearchOverlay';

const TOKEN_KEY = 'authToken';
const PROFILE_KEY = 'userProfile';

type AuthUser = { name: string; email: string; roles: string[] };

function readUser(): AuthUser | null {
try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    // Treat an expired token as logged out
    try {
    const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PROFILE_KEY);
        return null;
    }
    } catch {
    // Not a standard JWT: keep going
    }

    const raw = localStorage.getItem(PROFILE_KEY);
    const p = raw ? JSON.parse(raw) : {};

    const email: string = p.email || '';
    const name: string =
    p.fullName ||
    p.name ||
    [p.firstName, p.lastName].filter(Boolean).join(' ') ||
    p.userName ||
    email.split('@')[0] ||
    'User';

    const roles: string[] = Array.isArray(p.roles) ? p.roles : [];
    return { name, email, roles };
} catch {
    return null;
}
}

export default function Navbar() {
const [hasBanner, setHasBanner] = useState(false);
const pathname = usePathname();
const router = useRouter();

const { count } = useCart();
const [isMounted, setIsMounted] = useState(false);

const [user, setUser] = useState<AuthUser | null>(null);
const [menuOpen, setMenuOpen] = useState(false);
const [searchOpen, setSearchOpen] = useState(false);

useEffect(() => {
    setIsMounted(true);
}, []);

// Re-read the user on load and on every route change (login -> shop updates it)
useEffect(() => {
    setUser(readUser());
    setMenuOpen(false);
    setSearchOpen(false);
}, [pathname]);

// Sync when login/logout happens in another tab
useEffect(() => {
    const sync = () => setUser(readUser());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
}, []);

const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PROFILE_KEY);
    setUser(null);
    setMenuOpen(false);
    router.push('/');
};

const closeSearch = useCallback(() => setSearchOpen(false), []);

const checkBanner = useCallback(() => {
    const order = getPendingOrder();
    const shouldShow =
    order &&
    !pathname.startsWith('/order-success') &&
    !pathname.startsWith('/admin');
    setHasBanner(!!shouldShow);
}, [pathname]);

useEffect(() => {
    checkBanner();
    window.addEventListener('storage', checkBanner);
    const interval = setInterval(checkBanner, 500);
    return () => {
    window.removeEventListener('storage', checkBanner);
    clearInterval(interval);
    };
}, [checkBanner]);

const profileIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    </svg>
);

return (
    <>
    <header
        className={`fixed left-0 right-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
        hasBanner ? 'top-[41px] sm:top-[33px]' : 'top-0'
        }`}
    >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-2xl font-black tracking-tighter uppercase text-white">
            OUT<span className="text-orange-600">IN</span>
        </Link>

        {/* NAVIGATION LINKS */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-gray-300">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-orange-600 transition-colors">Shop</Link>
            <Link href="/#about" className="hover:text-orange-600 transition-colors">About</Link>
        </nav>

        {/* ACTIONS / ICONS */}
        <div className="flex items-center gap-5 text-white">
            {/* Search Icon: opens the search box */}
            <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="hover:text-orange-600 transition-colors p-1 cursor-pointer"
            >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            </button>

            {/* Profile: login link when signed out, small menu when signed in */}
            {!isMounted || !user ? (
            <Link href="/login" className="hover:text-orange-600 transition-colors p-1">
                {profileIcon}
            </Link>
            ) : (
            <div className="relative">
                <button
                onClick={() => setMenuOpen((o) => !o)}
                className="hover:text-orange-600 transition-colors p-1 cursor-pointer"
                aria-label="Account"
                >
                {profileIcon}
                </button>

                {menuOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-black border border-white/10 rounded p-4 shadow-xl">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">Signed in as</p>
                    <p className="mt-1 text-sm font-black truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>

                    {user.roles.includes('Admin') && (
                    <Link
                        href="/admin/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="mt-4 block w-full border border-white/20 hover:border-orange-600 hover:text-orange-600 text-center text-xs font-black uppercase tracking-wider py-2 transition-colors"
                    >
                        Dashboard
                    </Link>
                    )}

                    <button
                    onClick={handleLogout}
                    className="mt-2 w-full bg-[#FF4500] hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider py-2 transition-colors cursor-pointer"
                    >
                    Logout
                    </button>
                </div>
                )}
            </div>
            )}

            {/* Cart Icon with Live Count Badge */}
            <Link href="/cart" className="relative hover:text-orange-600 transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {isMounted && count > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF4500] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {count}
                </span>
            )}
            </Link>
        </div>
        </div>
    </header>

    {/* Outside the header on purpose: backdrop-blur would trap a fixed overlay inside it */}
    <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
);
}