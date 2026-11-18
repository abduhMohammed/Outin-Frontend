import Image from 'next/image';
import Link from 'next/link';

const BRAND_BG = '/images/brand-story-bg.png'; 

const PILLARS = [
{ word: 'OUT', text: 'Step outside the default path.', accent: true },
{ word: 'IN', text: 'Committed to the process.', accent: false },
{ word: 'BUILT', text: 'Made for the long run.', accent: true },
];

export default function BrandStory() {
return (
    <section className="relative overflow-hidden bg-black text-white py-20 md:py-28 px-6 md:px-12 border-t border-white/10">
    {/* BACKGROUND IMAGE + DARK OVERLAY (keeps the text readable) */}
    <div className="absolute inset-0 z-0">
        <Image
        src={BRAND_BG}
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto">
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[#FF4500] mb-5">
        Our Story
        </p>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.05] max-w-3xl">
        The uniform of
        <br />
        <span className="text-[#FF4500]">people who are building.</span>
        </h2>

        <p className="mt-6 max-w-xl text-sm sm:text-base text-gray-300 leading-relaxed">
        OUTIN is streetwear for the years between having an idea and building something real.
        Heavyweight cotton, quiet design, made to last.
        </p>

        {/* THREE PILLARS */}
        <div className="mt-14 md:mt-16 pt-10 border-t border-white/15 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {PILLARS.map((p) => (
            <div key={p.word}>
            <h3
                className={`text-4xl md:text-5xl font-black tracking-tight ${
                p.accent ? 'text-[#FF4500]' : 'text-white'
                }`}
            >
                {p.word}
            </h3>
            <p className="mt-3 text-sm text-gray-300">{p.text}</p>
            </div>
        ))}
        </div>

        <Link
        href="/shop"
        className="mt-12 inline-block bg-[#FF4500] hover:bg-orange-700 text-white text-xs font-extrabold uppercase px-8 py-3.5 tracking-wider transition-colors"
        >
        Shop Now
        </Link>
    </div>
    </section>
);
}