export default function LogoTicker() {
  const logos = [
    "Next.js", "React", "Node.js", "MongoDB", "Google Gemini", "Tailwind CSS", "Vercel", "Framer Motion", "Zustand"
  ];

  return (
    <div className="py-10 border-y border-white/5 bg-black overflow-hidden flex">
      <div className="flex gap-16 pr-16 animate-[marquee_30s_linear_infinite]">
        {[...logos, ...logos, ...logos].map((logo, idx) => (
          <div 
            key={idx} 
            className="text-xl font-bold text-muted/30 whitespace-nowrap"
          >
            {logo}
          </div>
        ))}
      </div>
    </div>
  );
}
