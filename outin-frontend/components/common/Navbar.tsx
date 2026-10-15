    import Link from 'next/link';

    export default function Navbar() {
    return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 text-white">
    <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

    {/* LOGO */}
    <Link href="/" className="text-2xl font-black tracking-tighter uppercase text-white flex items-center gap-1">
        OUT<span className="text-orange-600">IN</span>
    </Link>

    {/* NAVIGATION LINKS */}
    <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase text-gray-300">
        <Link href="/shop" className="hover:text-white transition-colors">
        SHOP
        </Link>
        <Link href="/#faculty-drops" className="hover:text-white transition-colors">
        FACULTY DROPS
        </Link>
        <Link href="/#about" className="hover:text-white transition-colors">
        ABOUT
        </Link>
    </nav>

    {/* RIGHT ICONS */}
    <div className="flex items-center gap-6">
        {/* SEARCH ICON */}
        <button aria-label="Search" className="hover:text-orange-500 transition-colors">
        <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        </button>

        {/* USER / LOGIN ICON (Added Here) */}
        <Link href="/login" aria-label="Login" className="hover:text-orange-500 transition-colors">
        <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        </Link>

        {/* CART ICON WITH BADGE */}
        <Link href="/cart" className="relative hover:text-orange-500 transition-colors">
        <svg className="w-5 h-5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <span className="absolute -top-1.5 -right-2 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            1
        </span>
        </Link>
    </div>

    </div>
    </header>
    );
    }