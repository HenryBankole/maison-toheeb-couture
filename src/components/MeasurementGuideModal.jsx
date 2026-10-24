import React from 'react';
import { X, Ruler, Sparkles, Check, Info } from 'lucide-react';

export default function MeasurementGuideModal({ onClose }) {
  const measurementPoints = [
    {
      point: "Neck Circumference",
      desc: "Wrap the measuring tape around the base of the neck where your shirt collar would normally sit. Keep one finger flat between the tape and neck for comfort.",
      typical: "15.5 - 18.5 inches"
    },
    {
      point: "Chest / Bust",
      desc: "Measure around the fullest part of your chest, keeping the tape level under your armpits and across your shoulder blades.",
      typical: "38 - 48 inches"
    },
    {
      point: "Shoulder Width",
      desc: "Measure from the tip of one shoulder bone across the natural curve of your upper back to the opposite shoulder tip.",
      typical: "18 - 21 inches"
    },
    {
      point: "Sleeve Length",
      desc: "With arm slightly bent, measure from the shoulder tip down along the outside of the arm to just past your wrist bone.",
      typical: "24 - 27 inches"
    },
    {
      point: "Kaftan Length",
      desc: "Measure from the base of your neck/shoulder down to your desired length. Standard Kaftan hangs mid-calf or ankle level.",
      typical: "50 - 58 inches"
    },
    {
      point: "Trouser Waist & Length",
      desc: "Measure waist where you prefer your senator trousers to rest. For length, measure from waistline down to the top of your shoes.",
      typical: "Waist: 32-42 in | Length: 39-44 in"
    },
    {
      point: "Cap / Fila Head Circumference",
      desc: "Measure around your head where the Fila sits, about 1 inch above your eyebrows and ears.",
      typical: "22 - 24 inches"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e1626] border border-gold-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090f1b]">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-gold-400" />
            <h2 className="font-serif text-lg font-bold text-slate-100">
              Master Tailor Measurement Guide
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          <div className="p-3.5 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs text-gold-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
            <div>
              <strong>Tailor's Rule of Thumb:</strong> When taking measurements for bespoke West African garments, always maintain a natural standing posture. Do not inhale deeply or suck in your belly for the most comfortable drape.
            </div>
          </div>

          <div className="space-y-3">
            {measurementPoints.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-gold-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-400 text-xs flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    {item.point}
                  </h4>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                    Typical: {item.typical}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-gold-500 hover:bg-gold-400 text-black font-semibold text-sm transition-all"
            >
              I Understand, Continue to Order
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
