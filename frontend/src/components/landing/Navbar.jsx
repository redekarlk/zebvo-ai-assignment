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
          <span className="text-white font-bold tracking-tight text-lg ml-1 hidden sm:block">Ai Website Builder</span>
        </Link>
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
