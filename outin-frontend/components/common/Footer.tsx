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
                href="/shop?cat=sweatpants"
            >
                Sweatpants
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
            <a
                className="hover:text-white transition-colors"
                href="https://wa.me/201552959939"
                rel="noreferrer"
                target="_blank"
            >
                Contact Us (WhatsApp)
            </a>
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
            href="https://www.instagram.com/outin.eg1/"
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
            href="https://www.tiktok.com/@outin_eg1?lang=en"
            rel="noreferrer"
            target="_blank"
            >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.28 2.56.02.91.48 1.8 1.25 2.29.98.63 2.27.56 3.17-.18.78-.62 1.22-1.62 1.22-2.62.01-4.98.01-9.96.01-14.94z" />
            </svg>
            </a>

            {/* FACEBOOK ICON */}
            <a
            aria-label="Facebook"
            className="hover:text-orange-600 transition-colors"
            href="https://www.facebook.com/profile.php?id=61592130853683"
            rel="noreferrer"
            target="_blank"
            >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
            </svg>
            </a>

            {/* YOUTUBE ICON */}
            <a
            aria-label="YouTube"
            className="hover:text-orange-600 transition-colors"
            href="https://www.youtube.com/channel/UCd7TfAM4ElldwNd60L8TRIQ"
            rel="noreferrer"
            target="_blank"
            >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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