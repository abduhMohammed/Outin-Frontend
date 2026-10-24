'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getToken, clearToken } from '@/lib/auth';

const navLinks = [
{ label: 'Dashboard', href: '/admin' },
{ label: 'Products', href: '/admin/products' },
{ label: 'Orders', href: '/admin/orders' },
{ label: 'Catalog', href: '/admin/catalog' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const [authorized, setAuthorized] = useState(false);
const pathname = usePathname();
const router = useRouter();

// UI-only guard: the real protection is [Authorize(Roles = Admin)] on the API
useEffect(() => {
    if (!getToken()) router.replace('/login');
    else setAuthorized(true);
}, [router]);

// Close the mobile menu when the page route changes
useEffect(() => {
    setIsMobileMenuOpen(false);
}, [pathname]);

// Stop the page behind the mobile menu from scrolling
useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
    document.body.style.overflow = '';
    };
}, [isMobileMenuOpen]);

const handleLogout = () => {
    clearToken();
    router.replace('/login');
};

const handleBack = () => {
    if (window.history.length > 1) router.back();
    else router.push('/admin');
};

const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

if (!authorized) {
    return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] text-xs font-bold text-neutral-400">
        Loading...
    </div>
    );
}

return (
    <div className="min-h-screen bg-[#F9F9F9] text-black flex flex-col md:flex-row font-sans">
    {/* DESKTOP SIDEBAR */}
    <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col justify-between p-6 shrink-0 sticky top-0 h-screen">
        <div className="space-y-8 overflow-y-auto">
        <div className="space-y-4">
            {/* Logo navigates back to store home page */}
            <Link href="/" className="text-xl font-black tracking-tighter block">
            OUT<span className="text-orange-600">IN</span>{' '}
            <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-bold uppercase ml-1">
                Admin
            </span>
            </Link>

            <button
            onClick={handleBack}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-neutral-500 hover:text-black transition-colors group cursor-pointer border border-neutral-200 px-3 py-2 rounded-sm bg-[#FAFAFA] hover:bg-white w-full"
            >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Go Back</span>
            </button>
        </div>

        <nav className="space-y-1 text-xs font-bold uppercase tracking-wider">
            {navLinks.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                className={`block px-3 py-2.5 rounded-sm transition-all ${
                isActive(link.href)
                    ? 'bg-orange-50 text-orange-600 font-black border-l-2 border-orange-600'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-black'
                }`}
            >
                {link.label}
            </Link>
            ))}
        </nav>
        </div>

        <div className="pt-4 border-t border-neutral-100 space-y-2">
        <Link
            href="/"
            className="flex items-center justify-between text-xs font-black text-neutral-800 hover:text-orange-600 transition-colors uppercase tracking-wider p-2 bg-neutral-50 hover:bg-neutral-100 rounded-sm"
        >
            <span>Back to Store</span>
            <span>↗</span>
        </Link>
        <button
            onClick={handleLogout}
            className="w-full text-left text-xs font-black uppercase tracking-wider text-red-600 hover:bg-red-50 p-2 rounded-sm cursor-pointer"
        >
            Logout
        </button>
        </div>
    </aside>

    {/* MOBILE / TABLET TOP BAR */}
    <header className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
        <button
            onClick={handleBack}
            className="w-9 h-9 border border-neutral-200 rounded-sm text-sm font-bold bg-neutral-50 active:bg-neutral-200 cursor-pointer"
            aria-label="Go back"
        >
            ←
        </button>
        {/* Logo navigates back to store home page */}
        <Link href="/" className="text-lg font-black tracking-tighter">
            OUT<span className="text-orange-600">IN</span>
        </Link>
        </div>

        <button
        onClick={() => setIsMobileMenuOpen((o) => !o)}
        className="h-9 px-3 border border-neutral-200 rounded text-xs font-bold bg-neutral-50 cursor-pointer"
        aria-expanded={isMobileMenuOpen}
        aria-label="Toggle menu"
        >
        {isMobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
    </header>

    {/* MOBILE MENU OVERLAY */}
    {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[61px] bottom-0 z-30 bg-white overflow-y-auto">
        <nav className="px-4 py-4 space-y-1 text-sm font-bold uppercase tracking-wider text-neutral-600">
            {navLinks.map((link) => (
            <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-sm ${
                isActive(link.href)
                    ? 'bg-orange-50 text-orange-600 font-black'
                    : 'hover:bg-neutral-100'
                }`}
            >
                {link.label}
            </Link>
            ))}
        </nav>

        <div className="px-4 pt-4 mt-2 border-t border-neutral-100 space-y-2">
            <Link
            href="/"
            className="block px-4 py-3 text-sm font-extrabold text-orange-600 uppercase tracking-wider"
            >
            ← Back to Store
            </Link>
            <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-3 text-sm font-extrabold text-red-600 uppercase tracking-wider cursor-pointer"
            >
            Logout
            </button>
        </div>
        </div>
    )}

    {/* PAGE CONTENT */}
    <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">{children}</main>
    </div>
);
}