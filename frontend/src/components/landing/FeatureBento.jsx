"use client";

import { motion } from "framer-motion";
import { Zap, Layout, Palette, Code } from "lucide-react";

const features = [
  {
    title: "Instant AI Generation",
    description: "Describe your business, and our Gemini integration creates a full, structured website in seconds.",
    icon: <Zap className="w-6 h-6 text-yellow-400" />,
    className: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Real-time Visual Editor",
    description: "Tweak copy and layout seamlessly in a live canvas.",
    icon: <Layout className="w-6 h-6 text-accent" />,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Global Theming",
    description: "Change colors and fonts across your entire site instantly.",
    icon: <Palette className="w-6 h-6 text-purple-400" />,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Export Anywhere",
    description: "Download raw React components, HTML, or deploy instantly.",
    icon: <Code className="w-6 h-6 text-emerald-400" />,
    className: "md:col-span-2 md:row-span-1",
  },
];

export default function FeatureBento() {
  return (
    <section id="features" className="py-32 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Everything you need to build faster.
        </h2>
        <p className="text-muted text-lg max-w-2xl mx-auto">
          We replaced complex interfaces with natural language and intuitive controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`glass-card rounded-3xl p-8 flex flex-col ${feature.className} relative overflow-hidden group`}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
            
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-auto">
              {feature.icon}
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-muted leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
