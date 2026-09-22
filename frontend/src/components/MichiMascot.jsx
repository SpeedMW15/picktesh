import React, { useState } from 'react'
import { Sparkles, Heart } from 'lucide-react'

export default function MichiMascot({ state = 'idle', speechBubble = null }) {
  const [isHappy, setIsHappy] = useState(false)

  const handleMichiClick = () => {
    setIsHappy(true)
    setTimeout(() => setIsHappy(false), 2000)
  }

  return (
    <div 
      className="relative inline-flex flex-col items-center select-none group cursor-pointer" 
      onClick={handleMichiClick}
    >
      {/* Nube de Diálogo / Globito de Texto */}
      {speechBubble && (
        <div className="absolute -top-12 bg-slate-900/95 border border-amber-500/50 text-amber-200 text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-xl whitespace-nowrap animate-bounce z-30 flex items-center gap-1.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{speechBubble}</span>
        </div>
      )}

      {/* SVG del Gatito Naranja Pachoncito */}
      <div className={`relative transition-all duration-300 ${state === 'thinking' ? 'animate-michi-purr' : 'animate-michi-float'}`}>
        
        {/* Corazoncito cuando le das clic */}
        {isHappy && (
          <div className="absolute -top-2 right-2 text-rose-400 animate-ping z-30">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        )}

        {/* Resplandor cálido de fondo */}
        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/30 transition duration-300" />

        <svg 
          width="120" 
          height="120" 
          viewBox="0 0 120 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="relative z-10 drop-shadow-2xl group-hover:scale-105 transition duration-300"
        >
          {/* Cola pachoncita atigrada */}
          <path d="M 82 82 Q 108 85 104 68 Q 100 55 90 64" stroke="#f97316" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M 82 82 Q 108 85 104 68 Q 100 55 90 64" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" fill="none" strokeDasharray="6 8" />

          {/* Cuerpo Redondito (Base Naranja) */}
          <ellipse cx="60" cy="68" rx="42" ry="36" fill="#f97316" />
          
          {/* Pecho de peluche blanco/crema */}
          <ellipse cx="60" cy="74" rx="26" ry="22" fill="#fff7ed" />

          {/* Franjas atigradas del cuerpo */}
          <path d="M 22 62 Q 32 64 26 72" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 98 62 Q 88 64 94 72" stroke="#ea580c" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* Orejitas */}
          <path d="M 28 36 L 20 12 L 44 24 Z" fill="#f97316" />
          <path d="M 30 34 L 23 16 L 41 25 Z" fill="#fb7185" opacity="0.7" />
          <path d="M 92 36 L 100 12 L 76 24 Z" fill="#f97316" />
          <path d="M 90 34 L 97 16 L 79 25 Z" fill="#fb7185" opacity="0.7" />

          {/* Cabeza Peludita */}
          <ellipse cx="60" cy="46" rx="36" ry="28" fill="#f97316" />

          {/* Franjas atigradas de la frente */}
          <path d="M 60 22 L 60 30" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
          <path d="M 52 24 L 54 31" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />
          <path d="M 68 24 L 66 31" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" />

          {/* Mejillas claritas */}
          <ellipse cx="60" cy="52" rx="20" ry="12" fill="#fff7ed" />

          {/* Ojos Gigantes y Brillantitos */}
          {state === 'thinking' ? (
            <>
              <path d="M 40 44 Q 48 36 52 44" stroke="#451a03" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 68 44 Q 72 36 80 44" stroke="#451a03" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : isHappy ? (
            <>
              <path d="M 40 42 Q 46 50 52 42" stroke="#451a03" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 68 42 Q 74 50 80 42" stroke="#451a03" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              {/* Ojo Izquierdo */}
              <circle cx="46" cy="43" r="7" fill="#451a03" />
              <circle cx="44" cy="41" r="2.5" fill="#ffffff" />
              <circle cx="48" cy="44.5" r="1" fill="#ffffff" />

              {/* Ojo Derecho */}
              <circle cx="74" cy="43" r="7" fill="#451a03" />
              <circle cx="72" cy="41" r="2.5" fill="#ffffff" />
              <circle cx="76" cy="44.5" r="1" fill="#ffffff" />
            </>
          )}

          {/* Rubor Rosado */}
          <ellipse cx="36" cy="49" rx="5" ry="3" fill="#fb7185" opacity="0.6" />
          <ellipse cx="84" cy="49" rx="5" ry="3" fill="#fb7185" opacity="0.6" />

          {/* Naricita y Boquita */}
          <polygon points="58,49 62,49 60,52" fill="#fb7185" />
          <path d="M 54 53 Q 60 58 60 53 Q 60 58 66 53" stroke="#451a03" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Bigotes tiernos */}
          <line x1="20" y1="46" x2="34" y2="48" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="53" x2="34" y2="52" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <line x1="100" y1="46" x2="86" y2="48" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
          <line x1="102" y1="53" x2="86" y2="52" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />

          {/* Patitas delanteras pachoncitas */}
          <ellipse cx="48" cy="98" rx="8" ry="6" fill="#fff7ed" stroke="#f97316" strokeWidth="2" />
          <ellipse cx="72" cy="98" rx="8" ry="6" fill="#fff7ed" stroke="#f97316" strokeWidth="2" />
        </svg>
      </div>
    </div>
  )
}