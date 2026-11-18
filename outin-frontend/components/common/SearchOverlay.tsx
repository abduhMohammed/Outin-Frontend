'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchOverlay({
open,
onClose,
}: {
open: boolean;
onClose: () => void;
}) {
const router = useRouter();
const inputRef = useRef<HTMLInputElement>(null);
const [query, setQuery] = useState('');

useEffect(() => {
    if (!open) return;

    inputRef.current?.focus();

    // lock page scroll while the search is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
    document.body.style.overflow = prevOverflow;
    window.removeEventListener('keydown', onKey);
    };
}, [open, onClose]);

if (!open) return null;

const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/shop?search=${encodeURIComponent(q)}`);
    setQuery('');
    onClose();
};

return (
    <div
    className="fixed inset-0 z-[110] bg-black/70"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-label="Search products"
    >
    <div
        className="bg-white text-black w-full sm:max-w-xl sm:mx-auto sm:mt-24 shadow-xl"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
        onClick={(e) => e.stopPropagation()}
    >
        <form onSubmit={submit} className="flex items-stretch">
        {/* text-base (16px) stops iOS Safari from zooming on focus */}
        <input
            ref={inputRef}
            autoFocus
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="flex-1 min-w-0 px-4 py-4 text-base font-bold outline-none bg-transparent"
        />

        <button
            type="submit"
            aria-label="Search"
            className="shrink-0 min-w-[56px] px-4 bg-[#FF4500] text-white text-xs font-black uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2"
        >
            <svg className="w-5 h-5 sm:hidden" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <span className="hidden sm:inline">Search</span>
        </button>

        <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 w-14 text-xl font-black text-neutral-500 hover:text-black cursor-pointer"
        >
            ✕
        </button>
        </form>
    </div>
    </div>
);
}