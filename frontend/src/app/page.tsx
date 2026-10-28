"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FireworksCanvas from "@/components/FireworksCanvas";
import ProductCard from "@/components/ProductCard";
import FeaturedCard from "@/components/FeaturedCard";
import PopularProductCard from "@/components/PopularProductCard";
import TypingFireQuote from "@/components/TypingFireQuote";
import Footer from "@/components/Footer";
import { productService } from "@/services/products/productService";
import { ProductDto } from "@/services/products/dto/product.dto";

export default function Home() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Dynamic live products state - ZERO mock data
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setIsLoading(true);
      try {
        const res = await productService.getProducts({ limit: 50 });
        if (isMounted) {
          setProducts(res.items || []);
        }
      } catch (err) {
        console.error("Failed to load products for home page:", err);
        if (isMounted) {
          setProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const testimonials = [
    {
      name: "Rajesh Malhotra",
      role: "Grand Wedding Organizer, Delhi",
      quote: "Savitri Fireworks turned our wedding event into a fairy tale. The 120 shots sky cakes were breathtaking, and their safety guidelines gave our team full peace of mind. Exceptional customer service!",
      stars: 5,
    },
    {
      name: "Ananya Deshmukh",
      role: "Diwali Festivities Coordinator, Pune",
      quote: "We've been buying our family crackers from Savitri for over a decade. Their eco-friendly green crackers produce very low smoke, but the colors are incredibly vibrant! Truly the most trusted brand.",
      stars: 5,
    },
    {
      name: "Vikramjit Singh",
      role: "Resort Owner, Udaipur",
      quote: "For corporate events and New Year spectacles, Savitri's elite display shells are our absolute go-to choice. Consistent ignition heights, gorgeous weeping willow patterns, and secure delivery.",
      stars: 5,
    },
  ];

  const faqs = [
    {
      q: "Are Savitri Fireworks safe to use for family celebrations?",
      a: "Yes, absolutely! Safety is our first priority. Every batch of our fireworks undergoes rigorous quality controls to ensure stable fuses, safe blast angles, and uniform combustion heights. We also provide clear safety guides with every purchase."
    },
    {
      q: "Do you offer eco-friendly 'green' crackers?",
      a: "Yes! In alignment with CSIR-NEERI guidelines, we offer a dedicated range of eco-friendly green crackers. These products use specialized chemical formulations that reduce particulate emissions and smoke by up to 30% without sacrificing sound or colors."
    },
    {
      q: "How can I purchase or place an enquiry?",
      a: "You can click any 'Enquiry Now' button across our site, visit our dedicated Enquiry Page, or contact us directly via phone or email. Our team will guide you through catalog item selection, licensed shipping requirements, and local regulations."
    },
    {
      q: "What is your shipping and delivery policy?",
      a: "We ship nationwide using licensed, certified fireworks transit logistics. Due to safety regulations governing explosives, transit times may vary. Doorstep dispatch is handled strictly through certified cargo agents in compliance with local rules."
    }
  ];

  const triggerBlastEvent = (e: React.MouseEvent) => {
    // Dispatch custom event to tell FireworksCanvas to spawn an explosion at click coordinates
    window.dispatchEvent(
      new CustomEvent("trigger-firework", {
        detail: {
          x: e.clientX,
          y: e.clientY,
          type: "crackle",
        },
      })
    );
  };

  const scrollSlider = (direction: "left" | "right", e: React.MouseEvent) => {
    triggerBlastEvent(e);

    const slider = sliderRef.current;
    if (!slider) return;

    const cardWidth = 320 + 24; // Card width (w-80 = 320px) + gap (gap-6 = 24px)
    if (direction === "left") {
      slider.scrollLeft -= cardWidth;
    } else {
      slider.scrollLeft += cardWidth;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 transition-colors duration-300 relative">

      {/* 1. LAYER 1: Full-Screen Background Image (At z-0, contained to the first viewport fold) */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-none">
        <img
          className="w-full h-full object-cover scale-105"
          src="/assets/firework.png"
          alt="Savitri Fireworks Celebration Background"
        />
        {/* Always dark overlay for the top hero segment to show fireworks beautifully */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-[1.5px]" />
      </div>

      {/* 2. LAYER 2: Viewport-Fixed Fireworks Canvas (At z-10, spans the entire scroll) */}
      <FireworksCanvas />

      {/* 3. LAYER 3: Hero Fold Content & Grid (At z-20, bg-transparent) */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-transparent z-20">

        {/* Hero Content Overlay */}
        <div className="max-w-5xl mx-auto w-full text-center px-4 sm:px-6 lg:px-8 pt-32 pb-16 flex flex-col items-center justify-center space-y-8 z-20 relative animate-fade-in">

          {/* Sparkle Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 duration-200 select-none shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-4 w-4 animate-spin"
              style={{ animationDuration: "12s" }}
            >
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.859 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
            </svg>
            India's Most Trusted Fireworks Brand
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl md:text-8xl drop-shadow-xl leading-tight select-none">
            Bring Magic to Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
              Celebrations
            </span>
          </h1>

          {/* Subhead Description */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-200/90 drop-shadow font-medium leading-relaxed select-none">
            Experience the sparkle of premium quality, eco-friendly, and highly safe fireworks. Handcrafted to light up your festivals, weddings, and milestones with colors and joy.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 text-center"
            >
              Explore Products
            </Link>
            <Link
              href="/enquiry"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 backdrop-blur-md shadow-md transition-all duration-300 hover:scale-105 active:scale-95 text-center"
            >
              Get in Touch
            </Link>
          </div>

          {/* Highlights / Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 pt-8 max-w-5xl w-full">
            {[
              { label: "100% Safe & Tested", desc: "Rigorous quality checks" },
              { label: "Eco-Friendly Sparks", desc: "Reduced smoke emissions" },
              { label: "Premium Craftsmanship", desc: "Vibrant colors & effects" },
              { label: "Pan-India Delivery", desc: "Doorstep licensed dispatch" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-black/50 border border-white/10 hover:border-orange-500/40 transition-all duration-300 text-center hover:-translate-y-1 shadow-xl select-none text-white"
              >
                <div className="text-sm font-extrabold">
                  {item.label}
                </div>
                <div className="text-xs text-zinc-400 mt-1 font-medium">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Soft bottom fade-out overlay that matches theme-specific backgrounds below */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-zinc-50 dark:from-black to-transparent pointer-events-none z-20 transition-all duration-300" />
      </section>

      {/* SECTION 2: PRODUCT SLIDER CATALOG (z-20, transparent bg to let Canvas at z-10 show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">

        {/* Section Heading (Centered inside max-width container) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-12 relative z-30">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
            Showcase Catalog
          </div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight">
            Explore Our Fireworks Range
          </h2>
          <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
            Explore our wide variety of safe, eco-friendly, and breathtaking fireworks categories. Hover over a card to trigger local sparks!
          </p>
        </div>

        {/* Marquee Slider Wrapper */}
        <div className="w-full overflow-hidden relative py-4">
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-48 bg-gradient-to-r from-zinc-50 dark:from-black to-transparent z-20 pointer-events-none transition-all duration-300" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-48 bg-gradient-to-l from-zinc-50 dark:from-black to-transparent z-20 pointer-events-none transition-all duration-300" />

          {isLoading ? (
            <div className="flex gap-6 justify-center items-center px-4 overflow-x-hidden">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className="flex-shrink-0 w-72 h-96 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-200/40 dark:bg-zinc-900/40 animate-pulse flex flex-col justify-end p-6"
                >
                  <div className="h-4 w-20 bg-zinc-300 dark:bg-zinc-800 rounded mb-2" />
                  <div className="h-6 w-48 bg-zinc-300 dark:bg-zinc-800 rounded mb-3" />
                  <div className="h-3 w-full bg-zinc-300 dark:bg-zinc-800 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="max-w-2xl mx-auto px-4 py-12 text-center bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-200/80 dark:border-white/10 shadow-lg relative z-30">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 mb-4 border border-orange-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 006.1 2.323z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white mb-2">
                Catalog Being Updated
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-6 font-medium">
                Our latest pyrotechnic collections are being cataloged for the season. Explore our categories or get in touch for custom festive requirements.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/products"
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:scale-105 active:scale-95"
                >
                  View All Products
                </Link>
                <Link
                  href="/enquiry"
                  className="px-6 py-2.5 rounded-full text-xs font-bold text-zinc-800 dark:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all border border-zinc-200 dark:border-white/10 hover:scale-105 active:scale-95"
                >
                  Contact For Orders
                </Link>
              </div>
            </div>
          ) : (
            <div className="marquee-container">
              <div className="marquee-content">
                {Array.from({ length: Math.ceil(8 / products.length) }, () => products)
                  .flat()
                  .map((p, idx) => (
                    <ProductCard
                      key={`orig-${p.id}-${idx}`}
                      name={p.name}
                      image={p.image}
                      desc={p.shortDesc || p.description}
                      code={p.code}
                      categoryName={p.category?.name}
                      href={`/products?search=${encodeURIComponent(p.name)}`}
                    />
                  ))}
                {Array.from({ length: Math.ceil(8 / products.length) }, () => products)
                  .flat()
                  .map((p, idx) => (
                    <ProductCard
                      key={`dup-${p.id}-${idx}`}
                      name={p.name}
                      image={p.image}
                      desc={p.shortDesc || p.description}
                      code={p.code}
                      categoryName={p.category?.name}
                      href={`/products?search=${encodeURIComponent(p.name)}`}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: FEATURED SPECIALTIES (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Section Heading */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
              Discover More
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight">
              Featured Specialties
            </h2>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
              Explore our special collections, safety guidelines, and seasonal arrivals curated for your perfect celebration.
            </p>
          </div>

          {/* 4 Cards Grid utilizing modular animated FeaturedCard components with staggered entrance delays */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeaturedCard
              title="Aerial Fireworks"
              desc="Spectacular high-altitude displays bursting with vibrant colors, dazzling patterns, and majestic sound."
              href="/products#aerial"
              type="aerial"
              delay={100}
            />
            <FeaturedCard
              title="Gift Boxes"
              desc="Exquisite selections of curated firework assortments, perfect for corporate gifting, family gatherings, and celebrations."
              href="/products#gifts"
              type="gift"
              delay={200}
            />
            <FeaturedCard
              title="New Arrivals"
              desc="Discover our newest innovations, featuring eco-friendly crackers, unique color combinations, and cutting-edge designs."
              href="/products#new"
              type="new"
              delay={300}
            />
            <FeaturedCard
              title="Safety Tips"
              desc="Essential guidelines and safety measures for families and retailers to ensure safe, smoke-reduced, and happy celebrations."
              href="/about#safety"
              type="safety"
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: POPULAR PRODUCTS WE OFFER (Redesigned as a Premium Frosted Island Container) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main Frosted Island Panel */}
          <div className="w-full bg-white/70 dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] py-16 px-6 md:px-12 shadow-2xl relative overflow-hidden">

            {/* Background glowing gradients inside the panel for rich aesthetics */}
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-amber-500/10 dark:bg-amber-500/5 blur-3xl pointer-events-none" />

            {/* Header Content & Navigation controls */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 relative z-30">
              <div className="space-y-4 text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
                  Customer Favorites
                </div>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-none">
                  Popular Products We Offer
                </h2>
                <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl font-medium">
                  Explore our handpicked customer favorites that are guaranteed to bring dynamic colors and loud joy to your celebration events.
                </p>
              </div>

              {/* Navigation Controls styled as modern orange glowing circles */}
              <div className="flex items-center gap-4 mt-6 md:mt-0">
                <button
                  onClick={(e) => scrollSlider("left", e)}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/30 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 active:scale-95 transition-all hover:scale-105 duration-200 cursor-pointer relative group"
                  aria-label="Scroll Left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={(e) => scrollSlider("right", e)}
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-500/30 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/10 hover:shadow-orange-500/25 active:scale-95 transition-all hover:scale-105 duration-200 cursor-pointer relative group"
                  aria-label="Scroll Right"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="h-6 w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Slider container nested inside the premium island */}
            <div className="w-full overflow-hidden relative py-4 z-20">
              {/* Fade masks inside the island container */}
              <div className="absolute top-0 bottom-0 left-0 w-8 md:w-24 bg-gradient-to-r from-white/70 dark:from-zinc-900/30 to-transparent z-20 pointer-events-none transition-all duration-300" />
              <div className="absolute top-0 bottom-0 right-0 w-8 md:w-24 bg-gradient-to-l from-white/70 dark:from-zinc-900/30 to-transparent z-20 pointer-events-none transition-all duration-300" />

              {isLoading ? (
                <div ref={sliderRef} className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className="flex-shrink-0 w-80 h-[28rem] rounded-3xl border border-zinc-200/80 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 animate-pulse p-6 flex flex-col justify-between"
                    >
                      <div className="h-52 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
                      <div className="space-y-3 mt-4">
                        <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        <div className="h-6 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12 px-4 max-w-lg mx-auto">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 mb-3 border border-orange-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.859 1.4-8.168L.132 9.21l8.2-1.192L12 .587z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-extrabold text-zinc-900 dark:text-white mb-2">
                    Customer Favorites Arriving Soon
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed font-medium">
                    Our top-rated celebration fireworks are being updated. Check our full inventory or request a product quote today.
                  </p>
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:scale-105 active:scale-95"
                  >
                    Explore Catalog
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
                      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.63l-3.01-3.01a.75.75 0 111.06-1.06l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06l3.01-3.01H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div
                  ref={sliderRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-2 scroll-smooth"
                >
                  {[...products]
                    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                    .slice(0, 10)
                    .map((p) => (
                      <PopularProductCard
                        key={`pop-${p.id}`}
                        name={p.name}
                        image={p.image}
                        desc={p.shortDesc || p.description}
                        tag={p.tag || (p.rating >= 5 ? "Bestseller" : "Popular")}
                        rating={p.rating || 5}
                        code={p.code}
                        categoryName={p.category?.name}
                        href={`/enquiry?product=${encodeURIComponent(p.name)}`}
                      />
                    ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: ABOUT US SECTION (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Column 1: Left - Heritage Story Content */}
            <div className="space-y-6 text-left relative z-30">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
                Our Story
              </div>

              <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-tight">
                Crafting Safe, Vibrant, and{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                  Magical Celebrations
                </span>
              </h2>

              {/* Styled Creative Quote Line */}
              <div className="relative pl-6 border-l-2 border-orange-500/70 text-zinc-500 dark:text-zinc-400 italic text-sm font-medium py-1">
                "A spark can light up a single dark night, but premium quality lights up a lifetime of warm festive memories."
              </div>

              <div className="space-y-4 text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                <p>
                  For over three decades, Savitri Fireworks has been at the forefront of designing and manufacturing premium-quality fireworks. What started as a small, passionate family workshop has grown into one of India’s most trusted names in festive celebrations, renowned for safety, color saturation, and unmatched visual artistry.
                </p>
                <p>
                  We believe that every milestone deserves a grand spectacle. That's why our team of dedicated pyrotechnic artisans constantly innovates, introducing eco-friendly, low-smoke, and child-safe sparks that keep the magic alive without compromising on the health of our environment.
                </p>
                <p>
                  From hand-held sparklers to breathtaking multi-shot sky-burst cakes, we deliver joy directly to your celebrations. Each product undergoes rigorous testing to ensure it meets our strict safety standards, giving you peace of mind while lighting up your night.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:to-red-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Read Our Story
                </Link>
              </div>
            </div>

            {/* Column 2: Right - Premium Floating Image Frame with Offset Outline Grid */}
            <div className="relative z-30 flex justify-center lg:justify-end">
              {/* Decorative radial blur glows behind the image frame */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-orange-500/10 dark:bg-orange-500/5 blur-3xl pointer-events-none" />

              {/* Offset Container */}
              <div className="relative group animate-float-slow max-w-md md:max-w-lg w-full">

                {/* 1. Creative Offset Frame */}
                <div className="absolute -inset-4 border border-orange-500/20 dark:border-orange-500/10 rounded-[2.5rem] pointer-events-none group-hover:scale-[1.03] group-hover:border-orange-500/40 transition-all duration-500 z-0" />

                {/* 2. Main Glass Frame */}
                <div className="p-3 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10">
                  <div className="relative h-96 w-full rounded-[2rem] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1533230898524-651547ec48f1?q=80&w=800&auto=format&fit=crop"
                      alt="Savitri Fireworks Celebration Artistry"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                    <div className="absolute bottom-6 right-6 px-4 py-1.5 rounded-full bg-black/60 border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 select-none shadow-md backdrop-blur-sm">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                      Celebrating Life
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE US & COUNTERS (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Column 1: Left - Dynamic Counters Stack */}
            <div className="space-y-6 relative z-30">

              {/* Stat 1: Products */}
              <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex items-start gap-6 group hover:border-orange-500/40 select-none">
                <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-400 to-orange-500 group-hover:scale-105 transition-transform duration-300 w-32 flex-shrink-0">
                  150+
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-lg font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors duration-300">
                    Premium Products
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    A massive catalog of sky cakes, fountains, sparklers, and child-safe novelties suited for every event scale.
                  </p>
                </div>
              </div>

              {/* Stat 2: Dealers */}
              <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex items-start gap-6 group hover:border-orange-500/40 select-none">
                <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-red-500 group-hover:scale-105 transition-transform duration-300 w-32 flex-shrink-0">
                  500+
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-lg font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors duration-300">
                    Licensed Dealers
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    A nationwide distribution network of certified dealers to ensure safe, legal, and rapid shipping dispatch.
                  </p>
                </div>
              </div>

              {/* Stat 3: Customers */}
              <div className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 flex items-start gap-6 group hover:border-orange-500/40 select-none">
                <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-pink-500 group-hover:scale-105 transition-transform duration-300 w-32 flex-shrink-0">
                  1M+
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="text-lg font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors duration-300">
                    Happy Celebrations
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    Over a million weddings, festivals, corporate milestones, and family gatherings lit up with our magical sparks.
                  </p>
                </div>
              </div>

            </div>

            {/* Column 2: Right - Why Choose Us Content */}
            <div className="space-y-8 text-left relative z-30">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
                  Why Choose Us
                </div>

                <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-tight">
                  The Savitri Fireworks{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500">
                    Promise
                  </span>
                </h2>

                <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                  We are committed to delivering the ultimate pyrotechnic experience. Here is why families and event organizers trust us with their celebrations:
                </p>
              </div>

              {/* Feature List */}
              <div className="space-y-6">
                {[
                  {
                    title: "Eco-Friendly Formulations",
                    desc: "Developed using green crackers recipes that reduce emissions by up to 30% while retaining rich sound and colorful light.",
                    color: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
                    svg: (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v13.5a1.5 1.5 0 001.5 1.5H18M3 9.75L12 3l9 6.75M4.5 19.5h15" />
                      </svg>
                    )
                  },
                  {
                    title: "Rigorous Safety Controls",
                    desc: "Every batch is tested under strict technical specifications to guarantee stable ignition, uniform heights, and child-safe sparks.",
                    color: "bg-amber-500/10 border-amber-500/20 text-amber-500",
                    svg: (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    )
                  },
                  {
                    title: "Pyrotechnic Craftsmanship",
                    desc: "Master artisans design our display shells, introducing premium patterns like golden weeping willows and crackling chrysanthemums.",
                    color: "bg-red-500/10 border-red-500/20 text-red-500",
                    svg: (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 006.1 2.323z" />
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start group font-sans">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 flex-shrink-0 ${item.color}`}>
                      {item.svg}
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-zinc-900 dark:text-white transition-colors duration-300 group-hover:text-orange-500">
                        {item.title}
                      </h4>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: TESTIMONIALS SECTION (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Section Heading */}
          <div className="text-center space-y-3 relative z-30">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
              Reviews
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-none">
              What Our Customers Say
            </h2>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
              Read stories from event planners, couples, and long-term customers who trust us to light up their special events.
            </p>
          </div>

          {/* Testimonial Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-30">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 shadow-lg hover:shadow-2xl hover:border-orange-500/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between min-h-[260px] select-none group"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 italic leading-relaxed font-medium">
                    "{item.quote}"
                  </p>
                </div>

                {/* Profile Signature */}
                <div className="mt-6 flex items-center gap-3.5 border-t border-zinc-100 dark:border-white/5 pt-4">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-black shadow-md">
                    {item.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white group-hover:text-orange-500 transition-colors duration-300">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">
                      {item.role}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 8: WHO WE ARE SECTION (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Column 1: Left - Premium Floating Image Frame with 3D Offset Parallax Layers */}
            <div className="relative z-30 flex justify-center lg:justify-start">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-red-500/10 dark:bg-red-500/5 blur-3xl pointer-events-none" />

              <div className="relative group animate-float-slow max-w-md md:max-w-lg w-full p-4">
                
                {/* 1. Parallax 3D Offset Backplane (shifts opposite to hover) */}
                <div className="absolute top-8 -left-8 w-full h-full bg-red-500/5 dark:bg-red-500/5 rounded-[2.5rem] border border-red-500/10 dark:border-red-500/5 pointer-events-none group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 z-0" />
                
                {/* 2. Scaled outline frame */}
                <div className="absolute inset-0 border border-red-500/20 dark:border-red-500/10 rounded-[2.5rem] pointer-events-none group-hover:scale-[1.02] group-hover:border-red-500/40 transition-all duration-500 z-0" />
                
                {/* 3. Main Glass Frame */}
                <div className="p-3 bg-white dark:bg-zinc-900/30 backdrop-blur-md border border-zinc-200/80 dark:border-white/10 rounded-[2.5rem] shadow-2xl relative overflow-hidden z-10">
                  <div className="relative h-96 w-full rounded-[2rem] overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
                      alt="Savitri Pyrotechnic Experts"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>

            {/* Column 2: Right - Who We Are Narrative Content */}
            <div className="space-y-6 text-left relative z-30">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
                Who Are We
              </div>

              <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-tight">
                About Savitri Fireworks —{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-pink-500 to-amber-500">
                  A Legacy of Light Since 1990.
                </span>
              </h2>

              {/* TYPING MANIFESTO FIRE QUOTE */}
              <div className="py-2 border-y border-zinc-200/30 dark:border-white/5">
                <TypingFireQuote />
              </div>

              {/* Editorial Styled Content */}
              <div className="space-y-5 text-left">
                {/* Lead Paragraph */}
                <p className="text-base md:text-lg text-zinc-700 dark:text-zinc-300 font-semibold leading-relaxed">
                  At Savitri Fireworks, we believe every celebration deserves to shine brighter. With a strong commitment to <span className="text-orange-500 font-extrabold">quality, safety, and customer satisfaction</span>, we have become a trusted name in providing premium fireworks for festivals, weddings, cultural events, and special occasions.
                </p>
                
                {/* Body Paragraphs */}
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Our carefully curated range includes vibrant aerial displays, colorful fountains, sparklers, crackers, and innovative fireworks that create unforgettable moments for families and communities alike. Every product is sourced and delivered with strict attention to safety standards, ensuring a joyful and worry-free celebration.
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Driven by years of industry experience and a passion for excellence, Savitri Fireworks combines traditional festive spirit with modern innovation. We continuously expand our collection to offer exciting new products while maintaining the reliability and quality our customers have come to expect.
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                  Whether you're purchasing for a family celebration or planning a large-scale event, our mission is simple—to deliver premium fireworks, exceptional service, and memorable experiences that light up every occasion.
                </p>

                {/* Styled Signature Badge */}
                <div className="pt-6 border-t border-zinc-200/50 dark:border-white/5 mt-6">
                  <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/10 dark:border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs md:text-sm font-extrabold uppercase tracking-widest shadow-inner">
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping flex-shrink-0" />
                    Savitri Fireworks – Lighting Celebrations with Quality, Safety & Trust.
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-full text-base font-bold text-white bg-gradient-to-r from-red-500 via-pink-500 to-amber-500 hover:from-red-600 hover:to-amber-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Explore Catalog
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ ACCORDION SECTION (z-20, transparent bg to let Canvas show through) */}
      <section className="relative w-full py-24 bg-transparent border-t border-zinc-200/50 dark:border-white/5 transition-colors duration-300 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Section Heading */}
          <div className="text-center space-y-3 relative z-30">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-[11px] font-extrabold uppercase tracking-wider select-none shadow-sm">
              FAQ
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white sm:text-5xl drop-shadow-sm dark:drop-shadow-md tracking-tight leading-none">
              Frequently Asked Questions
            </h2>
            <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto font-medium">
              Got questions about safety guidelines, green formulations, or logistics? Find quick answers right here.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4 relative z-30 text-left">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900/40 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-sm hover:border-orange-500/30"
                >
                  {/* Accordion Question Header */}
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-zinc-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-400 transition-colors focus:outline-none cursor-pointer text-left"
                  >
                    <span className="font-extrabold text-base md:text-lg pr-4">
                      {faq.q}
                    </span>
                    <span
                      className={`flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full border border-zinc-200 dark:border-white/20 text-zinc-500 dark:text-zinc-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-orange-500 border-orange-500/30" : ""
                        }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </span>
                  </button>

                  {/* Accordion Content Panel */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-48 border-t border-zinc-100 dark:border-white/5" : "max-h-0"
                      }`}
                  >
                    <div className="p-6 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium bg-zinc-50/50 dark:bg-black/20">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* SECTION 10: PREMIUM FOOTER SECTION */}
      <Footer />

    </div>
  );
}
