'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import LatestDrop from '@/components/home/LatestDrop';
import FacultyDrops from '@/components/home/FacultyDrops';
import BrandStory from '@/components/home/BrandStory';
import Footer from '@/components/common/Footer';
import PendingOrderBanner from '@/components/home/PendingOrderBanner';

const slides = [
  {
    id: 1,
    title: (
      <>
        OUT OF <br />
        THE CROWD. <br />
        <span className="text-[#FF4500]">INTO</span> <br />
        YOURSELF.
      </>
    ),
    subtitle: 'Streetwear for your identity. Your major, and your own path.',
    primaryBtnText: 'SHOP NOW',
    primaryBtnHref: '/shop',
    secondaryBtnText: 'VIEW LATEST DROP',
    secondaryBtnHref: '#latest-drop',
    image: '/hero-slide-1.jpg',
  },
  {
    id: 2,
    title: (
      <>
        REPRESENT <br />
        YOUR <br />
        <span className="text-[#FF4500]">FACULTY.</span>
      </>
    ),
    subtitle: 'Custom campus-pride designs tailored for Engineering, Medicine, CS, and Law.',
    primaryBtnText: 'FACULTY DROPS',
    primaryBtnHref: '#faculty-drops',
    secondaryBtnText: 'EXPLORE SHOP',
    secondaryBtnHref: '/shop',
    image: '/hero-slide-2.jpg',
  },
  {
    id: 3,
    title: (
      <>
        HEAVYWEIGHT <br />
        <span className="text-[#FF4500]">100% COTTON.</span> <br />
        BUILT TO LAST.
      </>
    ),
    subtitle: 'Premium Egyptian cotton built for daily campus wear and ultimate durability.',
    primaryBtnText: 'EVERYDAY OUTIN',
    primaryBtnHref: '/shop',
    secondaryBtnText: 'OUR STORY',
    secondaryBtnHref: '#about',
    image: '/hero-slide-3.jpg',
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slide rotation every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-[#FF4500] selection:text-white font-sans overflow-x-hidden">
      {/* PENDING ORDER BANNER (Fixed Overlay at z-[100]) */}
      <PendingOrderBanner />

      {/* NAVBAR */}
      <Navbar />

      {/* HERO SECTION WITH DYNAMIC SLIDER - Made longer on mobile */}
      <section className="relative w-full h-[95vh] sm:h-screen flex items-center overflow-hidden pt-36 sm:pt-20 pb-24">
        {/* SLIDES MAP CONTAINER */}
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* BACKGROUND IMAGE */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={slide.image}
                  alt="OUTIN Streetwear Hero Banner"
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                />
                {/* DARK GRADIENT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black via-black/85 sm:via-black/70 to-transparent" />
              </div>

              {/* HERO CONTENT */}
              <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 w-full my-auto">
                <div className="max-w-xl space-y-6 sm:space-y-6">
                  {/* MAIN HEADINGS */}
                  <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] uppercase">
                    {slide.title}
                  </h1>

                  {/* SUBTITLE */}
                  <p className="text-xs sm:text-base text-gray-300 font-medium tracking-wide max-w-xs sm:max-w-sm">
                    {slide.subtitle}
                  </p>

                  {/* CALL TO ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
                    <Link
                      href={slide.primaryBtnHref}
                      className="bg-[#FF4500] hover:bg-orange-700 text-white text-xs font-extrabold uppercase px-6 sm:px-8 py-3.5 tracking-wider text-center transition-all shadow-lg shadow-[#FF4500]/20"
                    >
                      {slide.primaryBtnText}
                    </Link>
                    <Link
                      href={slide.secondaryBtnHref}
                      className="border border-white/80 hover:bg-white hover:text-black text-white text-xs font-extrabold uppercase px-6 sm:px-8 py-3.5 tracking-wider text-center transition-all"
                    >
                      {slide.secondaryBtnText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* SLIDER CAROUSEL INTERACTIVE INDICATORS */}
        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                currentSlide === index ? 'w-8 sm:w-10 bg-[#FF4500]' : 'w-4 sm:w-6 bg-white/40 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
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
      <div id="about">
        <BrandStory />
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}