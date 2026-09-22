import React, { useState } from 'react'
import { Sparkles, Heart } from 'lucide-react'

export default function MichiMascot({ state = 'idle', speechBubble = null }) {
  const [isHappy, setIsHappy] = useState(false)

  const handleMichiClick = () => {
    setIsHappy(true)
    setTimeout(() => setIsHappy(false), 2000)
  }

  return (
    <div className="relative inline-flex flex-col items-center select-none group cursor-pointer" onClick={handleMichiClick}>
      
      {/* Nube de Diálogo / Globitot de Texto */}
      {speechBubble && (
        <div className="absolute -top-12 bg-slate-900 border border-indigo-500/40 text-indigo-200 text-[11px] font-bold px-3 py-1.5 rounded-2xl shadow-xl whitespace-nowrap animate-bounce z-20 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>{speechBubble}</span>
        </div>
      )}

      {/* SVG Gatito Redondito ("MichiTESH") */}
      <div className={`relative transition-transform duration-300 ${state === 'thinking' ? 'animate-michi-purr' : 'animate-michi-float'}`}>
        
        {/* Corazoncito cuando le das clic */}
        {isHappy && (
          <div className="absolute -top-4 right-0 text-rose-400 animate-ping">
            <Heart className="w-4 h-4 fill-current" />
          </div>
        )}

        <svg width="90" height="90" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
          {/* Orejitas */}
          <polygon points="22,38 12,18 36,28" fill="#6366f1" />
          <polygon points="24,36 17,22 34,29" fill="#f43f5e" />
          <polygon points="78,38 88,18 64,28" fill="#6366f1" />
          <polygon points="76,36 83,22 66,29" fill="#f43f5e" />

          {/* Cuerpo Redondito */}
          <circle cx="50" cy="56" r="36" fill="#4f46e5" />
          
          {/* Pancita tierna */}
          <ellipse cx="50" cy="64" rx="22" ry="18" fill="#818cf8" opacity="0.4" />

          {/* Ojos */}
          {state === 'thinking' ? (
            <>
              {/* Ojos cerrados pensando ^_^ */}
              <path d="M 32 48 Q 40 40 44 48" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 56 48 Q 60 40 68 48" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : isHappy ? (
            <>
              {/* Ojos feliz en forma de U */}
              <path d="M 32 44 Q 38 52 44 44" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 56 44 Q 62 52 68 44" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              {/* Ojos normales grandes y brillantes */}
              <circle cx="38" cy="46" r="5" fill="#ffffff" />
              <circle cx="62" cy="46" r="5" fill="#ffffff" />
              <circle cx="39.5" cy="44.5" r="2" fill="#0f172a" />
              <circle cx="63.5" cy="44.5" r="2" fill="#0f172a" />
            </>
          )}

          {/* Naricita y Boquita */}
          <polygon points="48,53 52,53 50,56" fill="#f43f5e" />
          <path d="M 45 57 Q 50 62 50 57 Q 50 62 55 57" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Rubor en las mejillas */}
          <ellipse cx="28" cy="52" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="72" cy="52" rx="4" ry="2.5" fill="#f43f5e" opacity="0.6" />

          {/* Bigotitos */}
          <line x1="12" y1="48" x2="26" y2="50" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="10" y1="56" x2="26" y2="55" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="88" y1="48" x2="74" y2="50" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
          <line x1="90" y1="56" x2="74" y2="55" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />

          {/* Patitas delanteras redonditas */}
          <ellipse cx="38" cy="84" rx="7" ry="5" fill="#3730a3" />
          <ellipse cx="62" cy="84" rx="7" ry="5" fill="#3730a3" />
        </svg>
      </div>
    </div>
  )
}