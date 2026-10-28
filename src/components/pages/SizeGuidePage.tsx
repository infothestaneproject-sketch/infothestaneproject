import React, { useState } from 'react';
import { ViewState } from '../../types';

interface SizeGuidePageProps {
  onNavigate: (view: ViewState) => void;
}

export const SizeGuidePage: React.FC<SizeGuidePageProps> = ({ onNavigate }) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  const tees = [
    { size: 'S', chestIn: '42', chestCm: '106', lengthIn: '28', lengthCm: '71', shoulderIn: '21', shoulderCm: '53' },
    { size: 'M', chestIn: '44', chestCm: '112', lengthIn: '29', lengthCm: '73.5', shoulderIn: '22', shoulderCm: '56' },
    { size: 'L', chestIn: '46', chestCm: '117', lengthIn: '30', lengthCm: '76', shoulderIn: '23', shoulderCm: '58.5' },
    { size: 'XL', chestIn: '48', chestCm: '122', lengthIn: '31', lengthCm: '78.5', shoulderIn: '24', shoulderCm: '61' },
    { size: 'XXL', chestIn: '50', chestCm: '127', lengthIn: '31.5', lengthCm: '80', shoulderIn: '25', shoulderCm: '63.5' },
  ];

  const hoodies = [
    { size: 'S', chestIn: '46', chestCm: '117', lengthIn: '27', lengthCm: '68.5', shoulderIn: '23', shoulderCm: '58.5' },
    { size: 'M', chestIn: '48', chestCm: '122', lengthIn: '28', lengthCm: '71', shoulderIn: '24', shoulderCm: '61' },
    { size: 'L', chestIn: '50', chestCm: '127', lengthIn: '29', lengthCm: '73.5', shoulderIn: '25', shoulderCm: '63.5' },
    { size: 'XL', chestIn: '52', chestCm: '132', lengthIn: '30', lengthCm: '76', shoulderIn: '26', shoulderCm: '66' },
    { size: 'XXL', chestIn: '54', chestCm: '137', lengthIn: '30.5', lengthCm: '77.5', shoulderIn: '27', shoulderCm: '68.5' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f7f6f2] py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b border-[#262624] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#787672] mb-1">
              FIT & TAILORING ARCHITECTURE
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-[0.14em] text-[#f7f6f2]">
              Size Guide
            </h1>
          </div>

          <div className="flex items-center space-x-1 bg-[#141414] border border-[#262624] p-1 text-xs font-mono">
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-3 py-1 uppercase cursor-pointer ${unit === 'in' ? 'bg-[#262624] text-[#f7f6f2] font-bold' : 'text-[#787672]'}`}
            >
              Inches
            </button>
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 uppercase cursor-pointer ${unit === 'cm' ? 'bg-[#262624] text-[#f7f6f2] font-bold' : 'text-[#787672]'}`}
            >
              Centimeters
            </button>
          </div>
        </div>

        {/* T-Shirt Table (No GSM) */}
        <div className="bg-[#0e0e0e] border border-[#262624] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-display font-bold uppercase tracking-wider text-[#f7f6f2]">
              Heavyweight Combed T-Shirts (Oversized Cut)
            </h2>
            <span className="text-[11px] font-mono text-white font-semibold">Boxy Drop Shoulder</span>
          </div>
          <div className="overflow-x-auto border border-[#262624]">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#141414] text-[#c8c5be] border-b border-[#262624]">
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest ({unit})</th>
                  <th className="py-3 px-4">Length ({unit})</th>
                  <th className="py-3 px-4">Shoulder ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1b1b]">
                {tees.map(r => (
                  <tr key={r.size} className="hover:bg-[#141414]/50">
                    <td className="py-3 px-4 font-bold text-[#f7f6f2]">{r.size}</td>
                    <td className="py-3 px-4">{unit === 'in' ? r.chestIn : r.chestCm}</td>
                    <td className="py-3 px-4">{unit === 'in' ? r.lengthIn : r.lengthCm}</td>
                    <td className="py-3 px-4">{unit === 'in' ? r.shoulderIn : r.shoulderCm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hoodie Table (No GSM) */}
        <div className="bg-[#0e0e0e] border border-[#262624] p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-display font-bold uppercase tracking-wider text-[#f7f6f2]">
              Heavy Loopback French Terry Hoodies
            </h2>
            <span className="text-[11px] font-mono text-white font-semibold">Structured Crossover Neck</span>
          </div>
          <div className="overflow-x-auto border border-[#262624]">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-[#141414] text-[#c8c5be] border-b border-[#262624]">
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Chest ({unit})</th>
                  <th className="py-3 px-4">Length ({unit})</th>
                  <th className="py-3 px-4">Shoulder ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1b1b]">
                {hoodies.map(r => (
                  <tr key={r.size} className="hover:bg-[#141414]/50">
                    <td className="py-3 px-4 font-bold text-[#f7f6f2]">{r.size}</td>
                    <td className="py-3 px-4">{unit === 'in' ? r.chestIn : r.chestCm}</td>
                    <td className="py-3 px-4">{unit === 'in' ? r.lengthIn : r.lengthCm}</td>
                    <td className="py-3 px-4">{unit === 'in' ? r.shoulderIn : r.shoulderCm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How to Measure */}
        <div className="p-6 bg-[#0e0e0e] border border-[#262624] space-y-4 font-mono text-xs text-[#8c8983]">
          <h3 className="font-display font-bold uppercase tracking-wider text-xs text-[#f7f6f2]">
            Measurement Instructions
          </h3>
          <p>• <strong>Chest:</strong> Measure across the chest from armpit to armpit with garment laid flat, then double for circumference.</p>
          <p>• <strong>Length:</strong> Measure from the highest point of the neck ribbing straight down to the bottom hem.</p>
          <p>• <strong>Shoulder:</strong> Measure straight across the back from shoulder seam to shoulder seam.</p>
        </div>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'shop', category: 'all' })}
            className="px-6 py-3 bg-[#f7f6f2] text-[#0a0a0a] font-display font-bold text-xs uppercase tracking-widest cursor-pointer"
          >
            Shop The Collection
          </button>
        </div>
      </div>
    </div>
  );
};
