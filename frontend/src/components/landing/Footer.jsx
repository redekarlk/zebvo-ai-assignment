import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black py-20 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 flex flex-col justify-between pt-[2px]">
              <svg viewBox="0 0 14 21" fill="none" className="w-6 h-6">
                 <path d="M0 0H14V7H7L0 0Z" fill="white"/>
                 <path d="M0 7H14V14H7L0 21V7Z" fill="white"/>
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">
              BuilderAI
            </span>
            </span>
          </Link>
          <p className="text-muted text-sm mb-6">
            Designing the future of the web with generative AI. Built for speed, scaled for production.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted hover:text-white transition-colors text-sm font-medium">
              Social Links
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Product</h4>
          <ul className="space-y-4 text-sm text-muted">
            <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-muted">
            <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Guides</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Templates</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-muted">
            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-sm text-muted">
        <p>© {new Date().getFullYear()} BuilderAI Inc. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Powered by Next.js & Google Gemini</p>
      </div>
    </footer>
  );
}
