import React from 'react';
import { Layers, ShieldCheck, Scissors, Sparkles } from 'lucide-react';

export const PillarsSection: React.FC = () => {
  const pillars = [
    {
      icon: <Layers className="w-5 h-5 text-white" />,
      title: "Custom Milled Textiles",
      spec: "Ultra-Heavyweight",
      desc: "Zero flimsy fabric. Milled from combed and ring-spun long-staple Indian cotton yarns with dense loopback structure."
    },
    {
      icon: <Scissors className="w-5 h-5 text-white" />,
      title: "Architectural Cut",
      spec: "Drop Shoulder Boxy",
      desc: "Engineered drape with precise shoulder drop, high collar ribbing, and extended torso length that preserves form."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-white" />,
      title: "Bio-Silicon Wash",
      spec: "Zero-Torque Stability",
      desc: "Pre-shrunk fabric treated with organic silicone wash to maintain buttery hand-feel and resist seam twists."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-white" />,
      title: "Atelier Craftsmanship",
      spec: "Independent Atelier",
      desc: "Every cut pattern, stitch tension, and screen print is inspected individually before Pan-India express dispatch."
    }
  ];

  return (
    <section className="bg-[#000000] border-b border-[#222222] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#888888]">
            Standard of Construction
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-[0.18em] text-white mt-2">
            Engineered For Permanence
          </h2>
          <p className="text-xs font-mono text-[#888888] mt-2">
            We reject the disposable nature of modern streetwear. Every garment is carved to endure wear, wash, and time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <div
              key={i}
              className="p-6 bg-[#0A0A0A] border border-[#222222] hover:border-white transition-colors flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-[#141414] border border-[#2A2A2A]">
                    {p.icon}
                  </div>
                  <span className="text-[10px] font-mono text-white uppercase tracking-widest border border-[#333333] px-2 py-0.5">
                    {p.spec}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-white mt-4">
                  {p.title}
                </h3>
                <p className="text-xs font-mono text-[#888888] mt-2 leading-relaxed">
                  {p.desc}
                </p>
              </div>
              <div className="text-[10px] font-mono text-[#555] uppercase tracking-widest pt-2 border-t border-[#1F1F1F]">
                STANE SPEC 0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
