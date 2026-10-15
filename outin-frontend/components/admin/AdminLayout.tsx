'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

return (
<div className="min-h-screen bg-[#F9F9F9] text-black flex flex-col md:flex-row font-sans overflow-x-hidden">
    <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col justify-between p-6 shrink-0 min-h-screen">
    <div className="space-y-8">
        <Link href="/admin" className="text-xl font-black tracking-tighter block">
        OUT<span className="text-orange-600">IN</span> <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-bold uppercase ml-1">Admin</span>
        </Link>
        <nav className="space-y-1 text-xs font-bold uppercase tracking-wider text-neutral-500">
        <Link href="/admin" className="block px-3 py-2.5 rounded hover:bg-neutral-100 transition-colors">
            Dashboard
        </Link>
        <Link href="/admin/products" className="block px-3 py-2.5 rounded bg-orange-50 text-orange-600">
            Products
        </Link>
        <Link href="/admin/orders" className="block px-3 py-2.5 rounded hover:bg-neutral-100 transition-colors">
            Orders
        </Link>
        <Link href="/admin/categories" className="block px-3 py-2.5 rounded hover:bg-neutral-100 transition-colors">
            Categories
        </Link>
        </nav>
    </div>

    <div className="pt-4 border-t border-neutral-100 space-y-2">
        <Link
        href="/"
        className="flex items-center gap-2 text-xs font-extrabold text-neutral-600 hover:text-orange-600 transition-colors uppercase tracking-wider"
        >
        &larr; Back to Store
        </Link>
    </div>
    </aside>

    <div className="md:hidden bg-white border-b border-neutral-200 p-4 flex items-center justify-between sticky top-0 z-40">
    <Link href="/admin" className="text-lg font-black tracking-tighter">
        OUT<span className="text-orange-600">IN</span>
    </Link>
    
    <div className="flex items-center gap-3">
        <Link href="/" className="text-[11px] font-bold text-neutral-500 hover:text-black">
        Store &rarr;
        </Link>
        <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="p-2 border border-neutral-200 rounded text-xs font-bold bg-neutral-50 cursor-pointer"
        >
        {isMobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
    </div>
    </div>

    {isMobileMenuOpen && (
    <div className="md:hidden bg-white border-b border-neutral-200 px-6 py-4 space-y-3 z-30 shadow-md">
        <nav className="space-y-1 text-xs font-bold uppercase tracking-wider text-neutral-600">
        <Link 
            href="/admin" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded hover:bg-neutral-100"
        >
            Dashboard
        </Link>
        <Link 
            href="/admin/products" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded bg-orange-50 text-orange-600"
        >
            Products
        </Link>
        <Link 
            href="/admin/orders" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded hover:bg-neutral-100"
        >
            Orders
        </Link>
        <Link 
            href="/admin/categories" 
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2 rounded hover:bg-neutral-100"
        >
            Categories
        </Link>
        </nav>
        <div className="pt-2 border-t border-neutral-100">
        <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-xs font-extrabold text-orange-600 uppercase tracking-wider"
        >
            &larr; Back to Store Front
        </Link>
        </div>
    </div>
    )}

    <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto w-full max-w-full">
    {children}
    </main>
</div>
);
}