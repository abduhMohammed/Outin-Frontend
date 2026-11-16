'use client';

import Image from 'next/image';

export default function BrandStory() {
const pillars = [
    {
    title: 'OUT',
    subtitle: 'OUT OF THE CROWD',
    tagline: 'Step Outside The Default Path',
    description:
        'Breaking away from repetition and noise. Clean, modern streetwear built for people who choose to build their own future instead of following the crowd.',
    accentColor: 'text-[#FF5A1F]',
    badgeBg: 'bg-[#FF5A1F]/10 text-[#FF5A1F]',
    },
    {
    title: 'IN',
    subtitle: 'IN TO THE WORK',
    tagline: 'Committed To The Process',
    description:
        'Focused on execution, discipline, and daily progress. Sharp, understated silhouettes that fit a client meeting just as well as a late-night work session.',
    accentColor: 'text-white',
    badgeBg: 'bg-white/10 text-gray-200',
    },
    {
    title: 'BUILT',
    subtitle: 'NOT GIVEN',
    tagline: 'Crafted For The Long Run',
    description:
        'Heavyweight Egyptian cotton (400–450 GSM) and considered construction made to last—an everyday uniform designed to back your journey.',
    accentColor: 'text-[#FF5A1F]',
    badgeBg: 'bg-[#FF5A1F]/10 text-[#FF5A1F]',
    },
];

const features = [
    {
    icon: (
        <svg className="w-5 h-5 stroke-[#FF5A1F] fill-none stroke-[2]" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    ),
    title: 'HEAVYWEIGHT COTTON',
    desc: '400–450 GSM premium fabric built for daily wear',
    },
    {
    icon: (
        <svg className="w-5 h-5 stroke-[#FF5A1F] fill-none stroke-[2]" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12l2 2 4-4" />
        </svg>
    ),
    title: 'NUMBERED EDITIONS',
    desc: 'Every piece carries its own edition mark',
    },
    {
    icon: (
        <svg className="w-5 h-5 stroke-[#FF5A1F] fill-none stroke-[2]" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
    title: 'QUIET DESIGN',
    desc: 'Clean silhouettes with zero loud hype',
    },
    {
    icon: (
        <svg className="w-5 h-5 stroke-[#FF5A1F] fill-none stroke-[2]" viewBox="0 0 24 24">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
    ),
    title: 'BUILT TO LAST',
    desc: 'Durable stitching and pre-shrunk structure',
    },
];

return (
    <section
    id="about"
    className="relative w-full bg-[#0D0D0D] text-white py-24 px-6 md:px-12 border-t border-white/10 overflow-hidden"
    >
    {/* BACKGROUND IMAGE OVERLAY */}
    <div className="absolute inset-0 z-0 opacity-60">
        <Image
        src="/images/brand-story-bg.png"
        alt="OUTIN Brand Story Background"
        fill
        sizes="100vw"
        className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#0D0D0D]/80 to-[#0D0D0D]" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto space-y-16">
        {/* SECTION HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5A1F]/10 border border-[#FF5A1F]/30 text-[#FF5A1F] text-xs font-black uppercase tracking-widest">
            <span>BRAND MANIFESTO</span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight leading-none">
            THE UNIFORM OF <br />
            <span className="text-[#FF5A1F]">PEOPLE WHO ARE BUILDING.</span>
            </h2>

            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl pt-2">
            <span className="font-bold text-white">OUTIN</span> is streetwear made for the years between having an idea and building something real. We celebrate the process—the first client, the late nights, and steady progress—through heavyweight quality and quiet, disciplined design[cite: 1, 2, 11].
            </p>
        </div>

        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end space-y-2">
            <span className="text-2xl font-black uppercase tracking-wide text-[#FF5A1F]">
            BUILT, NOT GIVEN.
            </span>
            <span className="text-xs text-gray-400 tracking-wider uppercase">
            OUT OF THE CROWD. IN TO THE WORK.
            </span>
        </div>
        </div>

        {/* THREE PILLARS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => (
            <div
            key={idx}
            className="group relative bg-[#141414]/90 border border-white/10 hover:border-[#FF5A1F]/50 transition-all duration-300 p-8 flex flex-col justify-between space-y-6 rounded-sm backdrop-blur-sm hover:-translate-y-1"
            >
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                <h3 className={`text-4xl sm:text-5xl font-black tracking-wider ${pillar.accentColor}`}>
                    {pillar.title}
                </h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 ${pillar.badgeBg}`}>
                    {pillar.subtitle}
                </span>
                </div>

                <p className="text-sm font-bold text-white tracking-wide pt-1">
                {pillar.tagline}
                </p>

                <p className="text-gray-300 text-xs leading-relaxed font-normal">
                {pillar.description}
                </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-bold text-gray-500 group-hover:text-white transition-colors">
                <span>OUTIN // STILL BUILDING</span>
                <span>0{idx + 1}</span>
            </div>
            </div>
        ))}
        </div>

        {/* FEATURES & VALUE PROPOSITIONS BAR */}
        <div className="pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3.5">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-sm shrink-0">
                {feature.icon}
            </div>
            <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-white">
                {feature.title}
                </h4>
                <p className="text-xs font-medium text-gray-300 leading-snug">
                {feature.desc}
                </p>
            </div>
            </div>
        ))}
        </div>
    </div>
    </section>
);
}