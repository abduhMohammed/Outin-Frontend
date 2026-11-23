import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import LatestDrop from '@/components/home/LatestDrop';
import BrandStory from '@/components/home/BrandStory';
import Footer from '@/components/common/Footer';
import PendingOrderBanner from '@/components/home/PendingOrderBanner';
import BestSellers from '@/components/home/BestSellers';
import CategoryTiles from '@/components/home/CategoryTiles';

export const revalidate = 300; // rebuild this page at most every 5 minutes

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#FF4500] selection:text-white font-sans overflow-x-hidden">
      {/* PENDING ORDER BANNER (Fixed Overlay at z-[100]) */}
      <PendingOrderBanner />

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative w-full h-[95vh] sm:h-screen flex items-center overflow-hidden pt-36 sm:pt-20 pb-24">
        {/* BACKGROUND IMAGE */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-slide-01.jpg"
            alt="OUTIN Streetwear Hero Banner"
            fill
            priority
            className="object-cover object-center"
          />
          {/* DARK GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/85 sm:via-black/70 to-transparent" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 w-full my-auto">
          <div className="max-w-xl space-y-6">
            {/* MAIN HEADING */}
            <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] uppercase">
              OUT OF <br />
              THE CROWD. <br />
              <span className="text-[#FF4500]">IN TO</span> <br />
              THE WORK.
            </h1>

            {/* SUBTITLE */}
            <p className="text-xs sm:text-base text-gray-300 font-medium tracking-wide max-w-xs sm:max-w-sm">
              The uniform of people who are building. Built, not given.
            </p>

            {/* CALL TO ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
              <Link
                href="/shop"
                className="bg-[#FF4500] hover:bg-orange-700 text-white text-xs font-extrabold uppercase px-6 sm:px-8 py-3.5 tracking-wider text-center transition-all shadow-lg shadow-[#FF4500]/20"
              >
                SHOP NOW
              </Link>
              <Link
                href="#latest-drop"
                className="border border-white/80 hover:bg-white hover:text-black text-white text-xs font-extrabold uppercase px-6 sm:px-8 py-3.5 tracking-wider text-center transition-all"
              >
                VIEW LATEST DROP
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LATEST DROP SECTION */}
      <div id="latest-drop">
        <LatestDrop />
      </div>

      {/* CATEGORIES */}
      <div id="categories">
        <CategoryTiles />
      </div>

      {/* BEST SELLERS */}
      <div id="best-sellers">
        <BestSellers />
      </div>

      {/* BRAND STORY / ABOUT */}
      <div id="about">
        <BrandStory />
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}