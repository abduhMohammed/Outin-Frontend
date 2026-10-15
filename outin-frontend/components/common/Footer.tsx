'use client';

import Link from 'next/link';

export default function Footer() {
return (
<footer className="bg-black text-white border-t border-white/10">
    {/* FOOTER NAVIGATION */}
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        {/* BRAND COLUMN */}
        <div className="md:col-span-1 space-y-3">
        <h3 className="text-2xl font-black tracking-tight">
            OUT<span className="text-orange-600">IN</span>
        </h3>
        <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
            OUT OF THE CROWD. <br />
            <span className="text-white">INTO YOURSELF.</span>
        </p>
        </div>

        {/* SHOP LINKS */}
        <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider">
            SHOP
        </h4>
        <ul className="space-y-2 text-xs text-gray-400">
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shop"
            >
                All Products
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shop?cat=t-shirts"
            >
                T-Shirts
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shop?cat=hoodies"
            >
                Hoodies
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shop?cat=sweatshirts"
            >
                Sweatshirts
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shop?cat=accessories"
            >
                Accessories
            </Link>
            </li>
        </ul>
        </div>

        {/* FACULTY DROPS LINKS */}
        <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider">
            FACULTY DROPS
        </h4>
        <ul className="space-y-2 text-xs text-gray-400">
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shop?faculty=engineering"
            >
                Engineering
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shop?faculty=medicine"
            >
                Medicine
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shop?faculty=pharmacy"
            >
                Pharmacy
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shop?faculty=business"
            >
                Business
            </Link>
            </li>
        </ul>
        </div>

        {/* HELP LINKS */}
        <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider">
            HELP
        </h4>
        <ul className="space-y-2 text-xs text-gray-400">
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/faq"
            >
                FAQ
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/shipping"
            >
                Shipping
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/returns"
            >
                Returns
            </Link>
            </li>
            <li>
            <Link
                className="hover:text-white transition-colors"
                href="/contact"
            >
                Contact
            </Link>
            </li>
        </ul>
        </div>

        {/* FOLLOW US */}
        <div className="space-y-3">
        <h4 className="text-xs font-black uppercase tracking-wider">
            FOLLOW US
        </h4>
        <div className="flex items-center gap-4 pt-1">
            {/* INSTAGRAM ICON */}
            <a
            aria-label="Instagram"
            className="hover:text-orange-600 transition-colors"
            href="https://instagram.com"
            rel="noreferrer"
            target="_blank"
            >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            </a>

            {/* TIKTOK ICON */}
            <a
            aria-label="TikTok"
            className="hover:text-orange-600 transition-colors"
            href="https://tiktok.com"
            rel="noreferrer"
            target="_blank"
            >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.28 2.56.02.91.48 1.8 1.25 2.29.98.63 2.27.56 3.17-.18.78-.62 1.22-1.62 1.22-2.62.01-4.98.01-9.96.01-14.94z" />
            </svg>
            </a>
        </div>
        </div>
    </div>

    {/* COPYRIGHT */}
    <div className="border-t border-white/10 pt-6 text-center">
        <p className="text-[11px] text-gray-500 font-medium">
        &copy; 2024 OUTIN. All Rights Reserved.
        </p>
    </div>
    </div>
</footer>
);
}