import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import LatestDrop from '@/components/home/LatestDrop';
import FacultyDrops from '@/components/home/FacultyDrops';
import BrandStory from '@/components/home/BrandStory';
import Footer from '@/components/common/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-orange-600 selection:text-white font-sans">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full h-screen flex items-center overflow-hidden pt-20">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.jpg"
            alt="OUTIN Streetwear Hero Banner"
            fill
            priority
            className="object-cover object-center"
          />
          {/* DARK GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-xl space-y-6">
            {/* MAIN HEADINGS */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] uppercase">
              OUT OF <br />
              THE CROWD. <br />
              <span className="text-orange-600">INTO</span> <br />
              YOURSELF.
            </h1>

            {/* SUBTITLE */}
            <p className="text-sm sm:text-base text-gray-300 font-medium tracking-wide max-w-sm">
              Streetwear for your identity. <br />
              your major, and your own path.
            </p>

            {/* CALL TO ACTION BUTTONS */}
            <div className="flex items-center gap-4 pt-4">
              <Link
                href="/shop"
                className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold uppercase px-8 py-3.5 tracking-wider transition-all shadow-lg shadow-orange-600/20"
              >
                SHOP NOW
              </Link>
              <Link
                href="#latest-drop"
                className="border border-white/80 hover:bg-white hover:text-black text-white text-xs font-extrabold uppercase px-8 py-3.5 tracking-wider transition-all"
              >
                VIEW LATEST DROP
              </Link>
            </div>
          </div>
        </div>

        {/* SLIDER CAROUSEL INDICATORS */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          <span className="w-8 h-1 bg-orange-600 rounded-full cursor-pointer"></span>
          <span className="w-8 h-1 bg-white/40 rounded-full cursor-pointer hover:bg-white transition-colors"></span>
          <span className="w-8 h-1 bg-white/40 rounded-full cursor-pointer hover:bg-white transition-colors"></span>
        </div>
      </section>

      {/* LATEST DROP SECTION */}
      <div id="latest-drop">
        <LatestDrop />
      </div>

      {/* FACULTY DROPS */}
      <div id="faculty-drops">
        <FacultyDrops />
      </div>

      {/* BRAND STORY / ABOUT */}
      <BrandStory />

      {/* FOOTER & BRAND STORY */}
      <Footer/>
    </div>
  );
}