import React from "react";

export default function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Base Elegant Gradient: Clean, bright minimalist blue to white */}
      <div className="absolute inset-0 bg-[#f8fbff]" />

      {/* Top Blue Wave Decoration from Clean Minimalism theme */}
      <svg className="absolute top-0 left-0 w-full opacity-60" viewBox="0 0 1024 120" fill="none" preserveAspectRatio="none">
        <path d="M0 0H1024V80C1024 80 840 40 512 80C184 120 0 80 0 80V0Z" fill="#1e40af" fillOpacity="0.04"/>
        <path d="M0 0H1024V60C1024 60 780 20 512 60C244 100 0 60 0 60V0Z" fill="#1e40af" fillOpacity="0.08"/>
      </svg>

      {/* Gentle Spherical Glowing Core in the Center for High-Contrast Text/Form Area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[70%] h-[80%] rounded-full bg-radial from-white via-white/80 to-transparent blur-3xl opacity-95" />

      {/* Wave Bottom Decoration from Clean Minimalism theme */}
      <svg className="absolute bottom-0 left-0 w-full opacity-60" viewBox="0 0 1024 150" fill="none" preserveAspectRatio="none">
        <path d="M0 150V80C200 120 400 40 600 80C800 120 1024 60 1024 60V150H0Z" fill="#3b82f6" fillOpacity="0.06"/>
        <path d="M0 150V100C250 140 500 60 750 100C900 120 1024 90 1024 90V150H0Z" fill="#1e3a8a" fillOpacity="0.04"/>
      </svg>

      {/* Cloud 1 (Left Middle) - Animated Floating */}
      <div 
        className="absolute top-[18%] left-[6%] md:left-[10%] opacity-40 select-none"
        style={{ animation: "float-slow 8s ease-in-out infinite" }}
      >
        <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
          <path d="M10 50 Q10 20 40 20 Q50 5 75 15 Q100 0 110 30 Q120 55 90 55 H20 Q10 55 10 50" fill="#bfdbfe" />
        </svg>
      </div>

      {/* Cloud 2 (Right Top/Middle) */}
      <div 
        className="absolute top-[24%] right-[5%] md:right-[15%] opacity-30 scale-75 select-none"
        style={{ animation: "float 6s ease-in-out infinite" }}
      >
        <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
          <path d="M10 50 Q10 20 40 20 Q50 5 75 15 Q100 0 110 30 Q120 55 90 55 H20 Q10 55 10 50" fill="#bfdbfe" />
        </svg>
      </div>

      {/* LEFT BORDER DECORATIONS */}
      <div className="absolute left-[3%] md:left-[5%] top-[40%] flex flex-col gap-10 items-center z-10">
        
        {/* Educational Globe Illustration */}
        <div 
          className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-3 flex items-center justify-center border border-blue-50/50"
          style={{ animation: "float 7s ease-in-out infinite" }}
        >
          <svg className="w-10 h-10 md:w-12 md:h-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M12 2a14.5 14.5 0 000 20M12 2a14.5 14.5 0 010 20M2 12h20M3 16.2A9.5 9.5 0 0021 16.2M3 7.8A9.5 9.5 0 0121 7.8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 21a1 1 0 011-1h12a1 1 0 011 1M12 20v2" />
          </svg>
        </div>

        {/* Stack of School Books */}
        <div 
          className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-3 flex flex-col justify-center items-center border border-blue-50/50"
          style={{ animation: "float-slow 9s ease-in-out infinite" }}
        >
          <svg className="w-10 h-10 md:w-12 md:h-12 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider font-mono">buku</div>
        </div>
      </div>

      {/* RIGHT BORDER DECORATIONS */}
      <div className="absolute right-[3%] md:right-[5%] top-[38%] flex flex-col gap-10 items-center z-10">
        
        {/* Floating Academic Graduation Cap (Topi Wisuda Kecil) */}
        <div 
          className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-3 flex flex-col items-center justify-center border border-blue-50/50"
          style={{ animation: "float 6s ease-in-out infinite 0.5s" }}
        >
          <svg className="w-10 h-10 md:w-12 md:h-12 text-slate-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3L2 8l10 5 10-5-10-5z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.5 12c-1.5 0-3-.5-4-1V8.5" />
          </svg>
          <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">lulus</span>
        </div>

        {/* Achievement Medal / Award Ribbon */}
        <div 
          className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl shadow-blue-900/5 p-3 flex flex-col items-center justify-center border border-blue-50/50"
          style={{ animation: "float-slow 8.5s ease-in-out infinite" }}
        >
          <svg className="w-10 h-10 md:w-12 md:h-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.21 13.89L7 21l5-1.5 5 1.5-1.21-7.11M12 5v6M9.5 8h5" />
          </svg>
        </div>
      </div>

      {/* SCATTERED SPARKLES, CONFETTI & STARS ON THE BORDERS */}
      {/* Sparkle 1 (Top Left) */}
      <div className="absolute top-[8%] left-[12%] text-amber-400 opacity-60 animate-pulse">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2L21.6 10l-5.4 4.8L17.4 22l-5.4-4.8L6.6 22l1.2-7.2L2.4 10l7.2-.8z" />
        </svg>
      </div>

      {/* Sparkle 2 (Right Top) */}
      <div className="absolute top-[12%] right-[18%] text-amber-500 opacity-50 animate-bounce">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>

      {/* Star Achievement Ornament (Left Bottom) */}
      <div className="absolute bottom-[15%] left-[15%] text-blue-400 opacity-40">
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l3.5 8.5L24 10l-6.5 6 2 9-7.5-5.5L4.5 25l2-9L0 10l8.5-1.5z" />
        </svg>
      </div>

      {/* Sparkle Group (Bottom Right) */}
      <div className="absolute bottom-[10%] right-[12%] text-amber-400 opacity-40">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </div>

      {/* Floating Sparkle Dust/Bintang Prestasi and Confetti Emas */}
      <div className="absolute top-[18%] left-[30%] w-2 h-2 rounded-full bg-yellow-400 opacity-65 animate-ping" />
      <div className="absolute top-[12%] right-[35%] w-3 h-3 rounded-full bg-blue-300 opacity-40 animate-pulse" />
      <div className="absolute bottom-[30%] left-[25%] w-2.5 h-2.5 bg-yellow-300 rotate-45 rounded-sm opacity-50" />
      <div className="absolute bottom-[20%] right-[30%] w-3 h-3 bg-amber-400 rotate-12 rounded-xs opacity-60" />

      {/* Subtle Confetti Sprinkles Top Center */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-[800px] h-20 overflow-hidden flex justify-around opacity-40">
        <div className="w-1.5 h-3 bg-yellow-400 rounded-sm rotate-12 transform translate-y-3" />
        <div className="w-2.5 h-1.5 bg-blue-400 rounded-sm -rotate-45 transform translate-y-6" />
        <div className="w-2 h-2 bg-amber-500 rounded-full transform translate-y-2 animate-bounce" />
        <div className="w-3 h-1.5 bg-blue-600 rounded-lg rotate-45 transform translate-y-8" />
        <div className="w-1.5 h-3 bg-yellow-500 rounded-sm -rotate-12 transform translate-y-4" />
        <div className="w-2.5 h-2.5 bg-cyan-400 rotate-12 rounded-sm transform translate-y-6" />
        <div className="w-2 h-2 bg-amber-400 rounded-full transform translate-y-1" />
        <div className="w-2 h-3 bg-blue-500 rounded-sm rotate-90 transform translate-y-7" />
      </div>
    </div>
  );
}
