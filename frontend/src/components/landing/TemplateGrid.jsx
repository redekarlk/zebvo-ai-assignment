"use client";

import { motion } from "framer-motion";

const templates = [
  { id: 1, title: "Algo", color: "bg-[#111111]", span: "col-span-1 row-span-2 md:col-span-2 md:row-span-2" },
  { id: 2, title: "State of Sites", color: "bg-[#1A1A1A]", span: "col-span-1 row-span-1 md:col-span-1 md:row-span-1" },
  { id: 3, title: "Haptic", color: "bg-[#FF451A]", span: "col-span-1 row-span-1 md:col-span-1 md:row-span-1" },
  { id: 4, title: "Compliance", color: "bg-[#FAFAFA]", span: "col-span-1 row-span-2 md:col-span-1 md:row-span-2" },
  { id: 5, title: "Cartesia", color: "bg-[#0A0A0A]", span: "col-span-1 row-span-2 md:col-span-1 md:row-span-2" },
  { id: 6, title: "Novel Reading", color: "bg-[#0055FF]", span: "col-span-1 row-span-2 md:col-span-2 md:row-span-2" },
  { id: 7, title: "Comet", color: "bg-[#F4F4F4]", span: "col-span-1 row-span-1 md:col-span-1 md:row-span-1" },
  { id: 8, title: "Sonar", color: "bg-[#14231C]", span: "col-span-1 row-span-1 md:col-span-2 md:row-span-1" },
];

export default function TemplateGrid() {
  return (
    <section className="bg-black px-4 pb-32">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 auto-rows-[250px] gap-4 max-w-[1600px] mx-auto">
        {templates.map((t, idx) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            className={`rounded-sm overflow-hidden ${t.color} ${t.span} relative group cursor-pointer border border-[#333]`}
          >
            {/* Placeholder Image/Graphic */}
            <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-80 group-hover:opacity-100 transition-opacity">
               <div className="text-white/50 text-sm font-medium">{t.title}</div>
               <div className="w-full h-1/2 bg-black/50 absolute bottom-0 left-0" />
            </div>
            {/* Fake UI elements to look like templates */}
            {idx % 3 === 0 && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-sm bg-[#0099FF] blur-xl opacity-50" />
            )}
            {idx % 4 === 0 && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] border border-[#333] rounded-sm shadow-2xl bg-[#111111] backdrop-blur-md" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
