// // import Image from 'next/image';

// // export default function BrandStory() {
// // return (
// // <section 
// //     id="about" 
// //     className="scroll-mt-20 relative w-full bg-black text-white py-20 px-6 md:px-12 border-t border-white/10 overflow-hidden"
// // >
// //     {/* BACKGROUND IMAGE / OVERLAY */}
// //     <div className="absolute inset-0 z-0 opacity 60">
// //     <Image 
// //         src="/images/brand-story-bg.png" 
// //         alt="OUTIN Brand Story Background" 
// //         fill
// //         sizes="100vw"
// //         className="object-cover object-center"
// //     />
// //     <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
// //     </div>

// //     <div className="relative z-10 max-w-7xl mx-auto space-y-12">
// //     {/* MAIN TEXT */}
// //     <div className="max-w-2xl space-y-4">
// //         <span className="text-orange-600 font-extrabold text-xs uppercase tracking-widest">
// //         BRAND STORY
// //         </span>
// //         <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
// //         More than clothing. <br />
// //         It&apos;s a way to express yourself.
// //         </h2>
// //         <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
// //         OUTIN is built for those who choose their own path. Inspired by student life, created for everyday confidence.
// //         </p>
// //         <div className="pt-2">
// //         <button className="border border-white/40 hover:border-white text-white text-xs font-bold uppercase px-6 py-3 tracking-widest transition-colors">
// //             LEARN MORE ABOUT OUTIN
// //         </button>
// //         </div>
// //     </div>

// //     {/* FEATURES GRID */}
// //     <div className="pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-extrabold uppercase tracking-widest text-gray-300">
// //         <div className="flex items-center gap-3">
// //         <svg className="w-5 h-5 stroke-orange-600 fill-none stroke-[2]" viewBox="0 0 24 24">
// //             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
// //         </svg>
// //         <span>QUALITY MATERIALS</span>
// //         </div>

// //         <div className="flex items-center gap-3">
// //         <svg className="w-5 h-5 stroke-orange-600 fill-none stroke-[2]" viewBox="0 0 24 24">
// //             <circle cx="12" cy="12" r="10" />
// //             <line x1="2" y1="12" x2="22" y2="12" />
// //             <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
// //         </svg>
// //         <span>MODERN DESIGNS</span>
// //         </div>

// //         <div className="flex items-center gap-3">
// //         <svg className="w-5 h-5 stroke-orange-600 fill-none stroke-[2]" viewBox="0 0 24 24">
// //             <circle cx="12" cy="12" r="10" />
// //             <polyline points="12 6 12 12 16 14" />
// //         </svg>
// //         <span>MADE FOR EVERYDAY</span>
// //         </div>

// //         <div className="flex items-center gap-3">
// //         <svg className="w-5 h-5 stroke-orange-600 fill-none stroke-[2]" viewBox="0 0 24 24">
// //             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
// //         </svg>
// //         <span>BUILT TO LAST</span>
// //         </div>
// //     </div>
// //     </div>
// // </section>
// // );
// // }
// 'use client';

// export default function BrandStory() {
// const pillars = [
// {
//     title: 'OUT',
//     tagline: 'الخروج عن المألوف',
//     description:
//     'الكسر من النمط التقليدي والابتعاد عن التكرار. ستايل الشارع العصري الذي يجعلك متميزًا في زحمة الجامعة.',
//     color: 'border-orange-500 text-orange-500',
// },
// {
//     title: 'IN',
//     tagline: 'العودة لذاتك وتخصصك',
//     description:
//     'الخطوة الأولى نحو تعزيز هويتك الخاصة، الفخر بكليتك، واختيار مسارك بثقة عبر تصاميم "برا الحشد".',
//     color: 'border-teal-600 text-teal-600',
// },
// {
//     title: 'YOU',
//     tagline: 'جودة تناسب حياتك اليومية',
//     description:
//     'قطع مصممة لتدوم من القطن المصري الثقيل، توفر لك الجودة العالية والراحة المستمرة وبسعر عادل للطلاب.',
//     color: 'border-black text-black',
// },
// ];

// return (
// <section className="bg-[#0D0D0D] text-white py-20 px-6 md:px-12 relative overflow-hidden">
//     {/* Background Accent Lines */}
//     <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around">
//     <div className="w-[1px] bg-white h-full"></div>
//     <div className="w-[1px] bg-white h-full"></div>
//     <div className="w-[1px] bg-white h-full"></div>
//     </div>

//     <div className="max-w-7xl mx-auto relative z-10">
//     {/* Section Header */}
//     <div className="max-w-3xl space-y-4">
//         <span className="text-orange-500 text-xs font-black uppercase tracking-widest">
//         BRAND MANIFESTO / قصة البراند
//         </span>
//         <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-tight">
//         MORE THAN CLOTHING. <br />
//         <span className="text-gray-400">IT'S YOUR CAMPUS IDENTITY.</span>
//         </h2>
//         <p className="text-gray-300 text-sm md:text-base leading-relaxed pt-2">
//         تأسس <span className="font-bold text-white">OUTIN</span> ليكون الصوت البصري للطلاب. بين ضغط الدراسة والتعبير عن الذات، نقدم ملاابس تجمع بين جودة الخامة العالية والتصاميم التي تحمل فخر تخصصك وشغفك اليومي.
//         </p>
//     </div>

//     {/* Pillars Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
//         {pillars.map((pillar, idx) => (
//         <div
//             key={idx}
//             className={`border-l-2 ${pillar.color} pl-6 py-4 space-y-3 bg-[#141414] p-6 rounded-r-lg transition-all hover:translate-x-1`}
//         >
//             <h3 className="text-4xl font-extrabold tracking-wider">
//             {pillar.title}
//             </h3>
//             <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
//             {pillar.tagline}
//             </p>
//             <p className="text-xs text-gray-300 leading-relaxed pt-2">
//             {pillar.description}
//             </p>
//         </div>
//         ))}
//     </div>

//     {/* Quality Banner / Tagline Footer */}
//     <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
//         <div className="space-y-1">
//         <p className="text-lg font-black uppercase tracking-widest text-orange-500">
//             "برا الحشد... جوه نفسك"
//         </p>
//         <p className="text-xs text-gray-400">
//             OUT OF THE CROWD. INTO YOURSELF.
//         </p>
//         </div>
//         <div className="flex gap-6 text-xs font-bold uppercase tracking-wider text-gray-300">
//         <span>✓ Heavyweight Cotton</span>
//         <span>✓ Fair Campus Price</span>
//         <span>✓ No Compromise</span>
//         </div>
//     </div>
//     </div>
// </section>
// );
// }
'use client';

import Image from 'next/image';

export default function BrandStory() {
const pillars = [
{
    title: 'OUT',
    subtitle: 'OUT OF THE CROWD',
    tagline: 'الخروج عن المألوف',
    description:
    'الابتعاد عن التكرار والأنماط التقليدية. ستايل الشارع العصري (Streetwear) الذي يعبر عن حضورك المتميز داخل وخارج الجامعة.',
    accentColor: 'border-[#FF5A1F] text-[#FF5A1F]',
    badgeBg: 'bg-[#FF5A1F]/10 text-[#FF5A1F]',
},
{
    title: 'IN',
    subtitle: 'INTO YOURSELF',
    tagline: 'العودة لذاتك وتخصصك',
    description:
    'خطوتك الأولى للتعبير عن مسارك وفخرك بكليتك، من خلال تصاميم "برا الحشد" المخصصة لكل تخصص بأسلوب شبابي غير تقليدي.',
    accentColor: 'border-[#0E4B4B] text-[#0E4B4B]',
    badgeBg: 'bg-[#0E4B4B]/20 text-[#0E4B4B]',
},
{
    title: 'YOU',
    subtitle: 'EVERYDAY CONFIDENCE',
    tagline: 'جودة تناسب حركتك اليومية',
    description:
    'قطع مصممة من القطن المصري الثقيل بأعلى معايير المتانة والراحة، لتعيش معك طوال اليوم وبسعر مناسب ومنافس للطلاب.',
    accentColor: 'border-[#F5F1E8] text-[#F5F1E8]',
    badgeBg: 'bg-white/10 text-[#F5F1E8]',
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
    desc: 'قطن مصري ثقيل 100%',
},
{
    icon: (
    <svg className="w-5 h-5 stroke-[#FF5A1F] fill-none stroke-[2]" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
    ),
    title: 'CAMPUS PRIDE',
    desc: 'تصاميم تعبر عن تخصصك',
},
{
    icon: (
    <svg className="w-5 h-5 stroke-[#FF5A1F] fill-none stroke-[2]" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
    ),
    title: 'FAIR PRICE',
    desc: 'سعر مناسب وبدون مساومة',
},
{
    icon: (
    <svg className="w-5 h-5 stroke-[#FF5A1F] fill-none stroke-[2]" viewBox="0 0 24 24">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
    ),
    title: 'BUILT TO LAST',
    desc: 'قصة متينة للاستخدام اليومي',
},
];

return (
<section 
    id="about" 
    className="relative w-full bg-[#0D0D0D] text-white py-24 px-6 md:px-12 border-t border-white/10 overflow-hidden"
>
    {/* BACKGROUND IMAGE OVERLAY */}
    <div className="absolute inset-0 z-0 opacity 100">
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
            MORE THAN CLOTHING. <br />
            <span className="text-[#FF5A1F]">IT'S YOUR CAMPUS IDENTITY.</span>
        </h2>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl pt-2">
            تأسس <span className="font-bold text-white">OUTIN</span> ليكون الهوية البصرية للجيل الجديد داخل الجامعة. بين ضغوط الدراسة والتعبير عن الذات، نمنحك ملابس تجمع بين الجودة العالية والتصاميم التي تحمل فخر تخصصك وشغفك اليومي.
        </p>
        </div>

        <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-end space-y-2">
        <span className="text-2xl font-black uppercase tracking-widest text-[#FF5A1F]">
            "برا الحشد... جوه نفسك"
        </span>
        <span className="text-xs text-gray-400 tracking-wider">
            OUT OF THE CROWD. INTO YOURSELF.
        </span>
        </div>
    </div>

    {/* THREE PILLARS CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => (
        <div
            key={idx}
            className="group relative bg-[#141414]/90 border border-white/10 hover:border-white/30 transition-all duration-300 p-8 flex flex-col justify-between space-y-6 rounded-sm backdrop-blur-sm hover:-translate-y-1"
        >
            <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className={`text-5xl font-black tracking-wider ${pillar.accentColor}`}>
                {pillar.title}
                </h3>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 ${pillar.badgeBg}`}>
                {pillar.subtitle}
                </span>
            </div>

            <p className="text-sm font-bold text-white tracking-wide">
                {pillar.tagline}
            </p>

            <p className="text-gray-200 text-xs leading-relaxed font-normal">
                {pillar.description}
            </p>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[11px] font-bold text-gray-500 group-hover:text-white transition-colors">
            <span>OUTIN STREETWEAR</span>
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
            {/* رفع درجة لون الخط العربي وزيادة حجمه للوضوح */}
            <p className="text-xs font-medium text-gray-200 leading-snug">
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