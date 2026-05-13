"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black"
    >
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-2">
          {/* Brand Logo */}
          <div className="w-8 h-8 flex flex-col justify-between pt-[2px]">
            <svg viewBox="0 0 14 21" fill="none" className="w-6 h-6">
               <path d="M0 0H14V7H7L0 0Z" fill="white"/>
               <path d="M0 7H14V14H7L0 21V7Z" fill="white"/>
            </svg>
          </div>
          <span className="text-white font-bold tracking-tight text-lg ml-1 hidden sm:block">Builder</span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-6 text-[15px] text-[#A1A1AA]">
        <Link href="#product" className="hover:text-white transition-colors">Product</Link>
        <Link href="#teams" className="hover:text-white transition-colors">Teams</Link>
        <Link href="#resources" className="hover:text-white transition-colors">Resources</Link>
        <Link href="#community" className="hover:text-white transition-colors">Community</Link>
        <Link href="#support" className="hover:text-white transition-colors">Support</Link>
        <Link href="#enterprise" className="hover:text-white transition-colors">Enterprise</Link>
        <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/login" 
          className="text-[15px] text-[#A1A1AA] hover:text-white transition-colors hidden md:block"
        >
          Log in
        </Link>
        <Link 
          href="/signup"
          className="text-[15px] font-medium bg-white text-black px-4 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          Sign up
        </Link>
      </div>
    </motion.nav>
  );
}
