"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative pt-48 pb-20 px-6 overflow-hidden flex flex-col items-center min-h-[70vh] bg-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto text-center flex flex-col items-center"
      >
        <div className="text-[13px] font-medium text-[#A1A1AA] mb-8 tracking-wide">
          <span className="text-white">State of Sites '26</span> • Unlock the report now
        </div>

        <h1 className="text-[64px] md:text-[96px] font-bold tracking-[-0.04em] text-white mb-6 leading-[1.05]">
          Build better<br />sites, faster
        </h1>
        
        <p className="text-[20px] text-[#A1A1AA] max-w-[600px] mx-auto mb-12 leading-[1.4] font-medium">
          Builder is the site builder trusted by leading startups and Fortune 500 companies. Build fast and scale more easily with an integrated CMS, analytics, localization, and SEO.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="flex items-center justify-center bg-white text-black px-6 py-3.5 rounded-full text-[15px] font-medium hover:bg-gray-100 transition-colors w-[140px]"
          >
            Start for free
          </Link>
          <Link 
            href="#ai"
            className="flex items-center justify-center px-6 py-3.5 rounded-full text-[15px] font-medium text-white bg-[#222222] hover:bg-[#333] transition-colors w-[140px]"
          >
            Start with AI
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
