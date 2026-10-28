import React, { useState } from 'react';
import { X, Ruler, Check, Info } from 'lucide-react';
import { ProductSize } from '../../types';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: 't-shirts' | 'hoodies';
  onSelectSize?: (size: ProductSize) => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  category = 't-shirts',
  onSelectSize
}) => {
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [activeTab, setActiveTab] = useState<'t-shirts' | 'hoodies'>(category);
  const [userHeight, setUserHeight] = useState<number>(175); // cm
  const [userWeight, setUserWeight] = useState<number>(70); // kg
  const [recommendedSize, setRecommendedSize] = useState<ProductSize | null>(null);

  if (!isOpen) return null;

  // Measurement charts
  const teeMeasurements = [
    { size: 'S', chestIn: '42', chestCm: '106', lengthIn: '28', lengthCm: '71', shoulderIn: '21', shoulderCm: '53' },
    { size: 'M', chestIn: '44', chestCm: '112', lengthIn: '29', lengthCm: '73.5', shoulderIn: '22', shoulderCm: '56' },
    { size: 'L', chestIn: '46', chestCm: '117', lengthIn: '30', lengthCm: '76', shoulderIn: '23', shoulderCm: '58.5' },
    { size: 'XL', chestIn: '48', chestCm: '122', lengthIn: '31', lengthCm: '78.5', shoulderIn: '24', shoulderCm: '61' },
    { size: 'XXL', chestIn: '50', chestCm: '127', lengthIn: '31.5', lengthCm: '80', shoulderIn: '25', shoulderCm: '63.5' },
  ];

  const hoodieMeasurements = [
    { size: 'S', chestIn: '46', chestCm: '117', lengthIn: '27', lengthCm: '68.5', shoulderIn: '23', shoulderCm: '58.5' },
    { size: 'M', chestIn: '48', chestCm: '122', lengthIn: '28', lengthCm: '71', shoulderIn: '24', shoulderCm: '61' },
    { size: 'L', chestIn: '50', chestCm: '127', lengthIn: '29', lengthCm: '73.5', shoulderIn: '25', shoulderCm: '63.5' },
    { size: 'XL', chestIn: '52', chestCm: '132', lengthIn: '30', lengthCm: '76', shoulderIn: '26', shoulderCm: '66' },
    { size: 'XXL', chestIn: '54', chestCm: '137', lengthIn: '30.5', lengthCm: '77.5', shoulderIn: '27', shoulderCm: '68.5' },
  ];

  const currentData = activeTab === 't-shirts' ? teeMeasurements : hoodieMeasurements;

  const calculateRecommendation = () => {
    let size: ProductSize = 'M';
    if (userHeight < 168) {
      size = userWeight < 60 ? 'S' : 'M';
    } else if (userHeight <= 176) {
      if (userWeight < 65) size = 'S';
      else if (userWeight <= 75) size = 'M';
      else size = 'L';
    } else if (userHeight <= 184) {
      if (userWeight < 72) size = 'M';
      else if (userWeight <= 85) size = 'L';
      else size = 'XL';
    } else {
      if (userWeight < 82) size = 'L';
      else if (userWeight <= 95) size = 'XL';
      else size = 'XXL';
    }
    setRecommendedSize(size);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e0e0e] border border-[#262624] text-[#f7f6f2] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262624]">
          <div className="flex items-center space-x-3">
            <Ruler className="w-5 h-5 text-[#f7f6f2]" />
            <div>
              <h2 className="text-sm sm:text-base font-display font-black uppercase tracking-[0.2em] text-[#f7f6f2]">
                Architectural Size Guide
              </h2>
              <p className="text-[11px] font-mono text-[#787672]">
                THE STANE PROJECT standard streetwear cuts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#787672] hover:text-[#f7f6f2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Unit Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
          <div className="flex bg-[#141414] border border-[#262624] p-1">
            <button
              type="button"
              onClick={() => setActiveTab('t-shirts')}
              className={`px-4 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                activeTab === 't-shirts' ? 'bg-[#f7f6f2] text-[#0a0a0a] font-bold' : 'text-[#8c8983] hover:text-[#f7f6f2]'
              }`}
            >
              Heavyweight Tees
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('hoodies')}
              className={`px-4 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                activeTab === 'hoodies' ? 'bg-[#f7f6f2] text-[#0a0a0a] font-bold' : 'text-[#8c8983] hover:text-[#f7f6f2]'
              }`}
            >
              Heavy Loopback Hoodies
            </button>
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

        {/* Measurement Table */}
        <div className="mt-6 overflow-x-auto border border-[#262624]">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-[#141414] text-[#c8c5be] border-b border-[#262624] text-[11px] tracking-wider uppercase">
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Chest ({unit})</th>
                <th className="py-3 px-4">Length ({unit})</th>
                <th className="py-3 px-4">Shoulder ({unit})</th>
                {onSelectSize && <th className="py-3 px-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b1b1b]">
              {currentData.map((row) => {
                const isRec = recommendedSize === row.size;
                return (
                  <tr
                    key={row.size}
                    className={`transition-colors ${
                      isRec ? 'bg-amber-400/10 text-[#f7f6f2]' : 'hover:bg-[#141414]/60 text-[#c8c5be]'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#f7f6f2] flex items-center space-x-2">
                      <span>{row.size}</span>
                      {isRec && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-amber-400 text-black font-mono font-bold rounded">
                          RECOMMENDED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {unit === 'in' ? row.chestIn : row.chestCm}
                    </td>
                    <td className="py-3 px-4">
                      {unit === 'in' ? row.lengthIn : row.lengthCm}
                    </td>
                    <td className="py-3 px-4">
                      {unit === 'in' ? row.shoulderIn : row.shoulderCm}
                    </td>
                    {onSelectSize && (
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectSize(row.size as ProductSize);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-[#262624] hover:bg-[#f7f6f2] hover:text-[#0a0a0a] text-xs font-mono uppercase transition-colors cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Fit note */}
        <div className="mt-4 p-3 bg-[#141414] border border-[#262624] flex items-start space-x-2.5 text-xs font-mono text-[#8c8983]">
          <Info className="w-4 h-4 text-[#c8c5be] shrink-0 mt-0.5" />
          <p>
            <strong className="text-[#f7f6f2]">Fit Philosophy:</strong> Our garments feature an intentional 2-3 inch dropped shoulder with extended sleeve lengths. We recommend choosing your true standard Indian size for our intended oversized streetwear drape, or size down for a standard regular fit.
          </p>
        </div>

        {/* Interactive Fit Calculator */}
        <div className="mt-6 pt-6 border-t border-[#262624] space-y-4">
          <h3 className="text-xs font-display font-black uppercase tracking-[0.2em] text-[#f7f6f2]">
            Find Your Exact Size (Instant Calculator)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#787672] uppercase mb-1">
                Your Height: {userHeight} cm ({Math.floor(userHeight / 30.48)}' {Math.round((userHeight % 30.48) / 2.54)}")
              </label>
              <input
                type="range"
                min="155"
                max="200"
                value={userHeight}
                onChange={e => setUserHeight(Number(e.target.value))}
                className="w-full accent-[#f7f6f2]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-[#787672] uppercase mb-1">
                Your Body Weight: {userWeight} kg
              </label>
              <input
                type="range"
                min="45"
                max="120"
                value={userWeight}
                onChange={e => setUserWeight(Number(e.target.value))}
                className="w-full accent-[#f7f6f2]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={calculateRecommendation}
              className="px-4 py-2 bg-[#f7f6f2] hover:bg-white text-[#0a0a0a] text-xs font-display font-bold uppercase tracking-widest transition-colors cursor-pointer"
            >
              Calculate My Fit
            </button>

            {recommendedSize && (
              <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
                <Check className="w-4 h-4" />
                <span>
                  Recommended for your frame: <strong className="text-[#f7f6f2] text-sm">Size {recommendedSize}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
