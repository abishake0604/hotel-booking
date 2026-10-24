import React from 'react';

interface HotelVisualArtProps {
  hotelId: string;
  className?: string;
  aspect?: 'video' | 'card' | 'wide';
}

export const HotelVisualArt: React.FC<HotelVisualArtProps> = ({
  hotelId,
  className = 'w-full h-full',
  aspect = 'card',
}) => {
  // Artistic architectural SVG rendering tailored to each hotel's environment
  switch (hotelId) {
    case 'hotel-azure-amalfi':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-sky-950 via-teal-900 to-blue-950 flex items-center justify-center ${className}`}>
          {/* Coastal Cliff & Sunset Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/20 via-sky-800/10 to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-80" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Horizon Sun & Sea */}
            <circle cx="300" cy="180" r="70" fill="url(#amalfi-sun)" />
            <path d="M0 240 Q150 235 300 240 T600 240 L600 400 L0 400 Z" fill="#082f49" fillOpacity="0.7" />
            <path d="M0 270 Q200 260 400 270 T600 270 L600 400 L0 400 Z" fill="#075985" fillOpacity="0.5" />
            
            {/* Cliffside Villa Architecture */}
            <path d="M420 160 L580 160 L580 340 L380 340 L380 230 Z" fill="#1e293b" fillOpacity="0.85" />
            <polygon points="410,160 500,110 590,160" fill="#0f172a" />
            {/* Terraced Arches */}
            <rect x="440" y="190" width="24" height="38" rx="12" fill="#fbbf24" fillOpacity="0.65" />
            <rect x="480" y="190" width="24" height="38" rx="12" fill="#fbbf24" fillOpacity="0.65" />
            <rect x="520" y="190" width="24" height="38" rx="12" fill="#fbbf24" fillOpacity="0.65" />
            {/* Infinity Pool Edge */}
            <rect x="360" y="270" width="160" height="12" rx="4" fill="#38bdf8" fillOpacity="0.7" />
            {/* Cypress & Maritime Pines */}
            <path d="M330 320 C325 280 335 240 330 210 C325 240 335 280 330 320 Z" fill="#064e3b" stroke="#047857" strokeWidth="2" />
            <path d="M350 330 C345 290 355 250 350 220 C345 250 355 290 350 330 Z" fill="#064e3b" stroke="#047857" strokeWidth="2" />
            
            <defs>
              <radialGradient id="amalfi-sun" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#fb923c" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
          <div className="absolute bottom-4 left-5 text-white/90">
            <span className="text-xs uppercase tracking-widest text-teal-300 font-medium">Tyrrhenian Seafront</span>
          </div>
        </div>
      );

    case 'hotel-kyoto-onsen':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-stone-950 via-amber-950/70 to-neutral-900 flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/60" />
          <svg className="absolute inset-0 w-full h-full opacity-85" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Full Moon */}
            <circle cx="460" cy="110" r="50" fill="#fef3c7" fillOpacity="0.6" />
            
            {/* Japanese Mountain Silhouette */}
            <path d="M0 260 Q180 170 340 240 T600 220 L600 400 L0 400 Z" fill="#1c1917" />
            
            {/* Traditional Pagoda Rooflines */}
            <path d="M120 180 Q200 160 280 180 L290 200 Q200 190 110 200 Z" fill="#292524" />
            <path d="M140 210 Q200 195 260 210 L270 230 Q200 220 130 230 Z" fill="#44403c" />
            <rect x="150" y="230" width="100" height="90" fill="#1c1917" />
            
            {/* Shoji Screens Glowing */}
            <rect x="165" y="245" width="28" height="60" rx="2" fill="#fde68a" fillOpacity="0.7" />
            <rect x="205" y="245" width="28" height="60" rx="2" fill="#fde68a" fillOpacity="0.7" />
            
            {/* Bamboo Stems */}
            <line x1="390" y1="400" x2="385" y2="180" stroke="#78716c" strokeWidth="3" />
            <line x1="410" y1="400" x2="408" y2="150" stroke="#78716c" strokeWidth="4" />
            <line x1="430" y1="400" x2="435" y2="190" stroke="#57534e" strokeWidth="3" />
            
            {/* Onsen Steam Clouds */}
            <path d="M340 320 Q350 280 370 290 T390 260" stroke="#fef3c7" strokeWidth="2" strokeDasharray="3 3" opacity="0.4" />
          </svg>
          <div className="absolute bottom-4 left-5 text-white/90">
            <span className="text-xs uppercase tracking-widest text-amber-300 font-medium">Cedar Pavilion & Onsen</span>
          </div>
        </div>
      );

    case 'hotel-alpine-matterhorn':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-slate-950 via-sky-950 to-stone-900 flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-400/15 via-transparent to-black/50" />
          <svg className="absolute inset-0 w-full h-full opacity-85" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Matterhorn Iconic Triangular Peak */}
            <polygon points="320,60 180,310 460,310" fill="#1e293b" />
            <polygon points="320,60 270,160 320,310" fill="#f1f5f9" fillOpacity="0.4" />
            <polygon points="320,60 410,210 320,310" fill="#334155" />
            {/* Snow Crests */}
            <path d="M320 60 L340 140 L310 180 L350 240 L320 310" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
            
            {/* Timber Chalet Foreground */}
            <polygon points="120,240 220,180 320,240" fill="#0f172a" />
            <rect x="140" y="240" width="160" height="90" fill="#1e293b" />
            {/* Chalet Windows Glowing Warm */}
            <rect x="160" y="255" width="30" height="30" rx="3" fill="#fdba74" fillOpacity="0.8" />
            <rect x="210" y="255" width="40" height="40" rx="3" fill="#fdba74" fillOpacity="0.85" />
            <rect x="270" y="255" width="20" height="30" rx="3" fill="#fdba74" fillOpacity="0.7" />
            
            {/* Pine Trees */}
            <polygon points="80,270 60,340 100,340" fill="#064e3b" />
            <polygon points="80,240 65,290 95,290" fill="#065f46" />
            <polygon points="420,260 400,340 440,340" fill="#064e3b" />
          </svg>
          <div className="absolute bottom-4 left-5 text-white/90">
            <span className="text-xs uppercase tracking-widest text-sky-300 font-medium">Glacier Mountain Alpine</span>
          </div>
        </div>
      );

    case 'hotel-manhattan-tribeca':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-stone-900 flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-black/70" />
          <svg className="absolute inset-0 w-full h-full opacity-80" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Manhattan Skyline Silhouette */}
            <rect x="80" y="140" width="70" height="260" fill="#18181b" />
            <rect x="170" y="80" width="90" height="320" fill="#27272a" />
            <polygon points="215,30 190,80 240,80" fill="#3f3f46" />
            <rect x="280" y="160" width="80" height="240" fill="#18181b" />
            <rect x="380" y="110" width="100" height="290" fill="#27272a" />
            
            {/* Tribeca Warehouse Grid Windows */}
            {[0, 1, 2, 3, 4].map((row) => (
              <React.Fragment key={row}>
                <rect x="185" y={110 + row * 38} width="16" height="22" rx="2" fill="#fef08a" fillOpacity={row % 2 === 0 ? 0.75 : 0.3} />
                <rect x="210" y={110 + row * 38} width="16" height="22" rx="2" fill="#fef08a" fillOpacity={row % 3 === 0 ? 0.8 : 0.25} />
                <rect x="235" y={110 + row * 38} width="16" height="22" rx="2" fill="#fef08a" fillOpacity={row % 2 === 1 ? 0.7 : 0.4} />
              </React.Fragment>
            ))}
            
            {/* Rooftop Lounge Deck String Lights */}
            <path d="M30 310 Q300 295 570 310" stroke="#fef08a" strokeWidth="2" strokeDasharray="4 8" opacity="0.8" />
          </svg>
          <div className="absolute bottom-4 left-5 text-white/90">
            <span className="text-xs uppercase tracking-widest text-zinc-300 font-medium">Historic Tribeca Loft</span>
          </div>
        </div>
      );

    case 'hotel-santorini-oia':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-sky-950 via-blue-900 to-indigo-950 flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/25 via-blue-700/20 to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-85" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Sunset Disk over Caldera */}
            <circle cx="340" cy="160" r="55" fill="#fed7aa" fillOpacity="0.85" />
            {/* Caldera Rim */}
            <path d="M0 240 Q160 210 320 240 T600 230 L600 400 L0 400 Z" fill="#0f172a" />
            
            {/* Iconic Blue Dome & Whitewashed Curves */}
            <path d="M220 260 A40 40 0 0 1 300 260 Z" fill="#0284c7" />
            <rect x="210" y="260" width="100" height="80" rx="6" fill="#f8fafc" />
            <polygon points="260,205 260,220" stroke="#f8fafc" strokeWidth="4" />
            
            {/* Cavern Balcony with Plunge Pool */}
            <rect x="330" y="280" width="140" height="70" rx="8" fill="#f1f5f9" />
            <rect x="350" y="300" width="80" height="35" rx="6" fill="#38bdf8" fillOpacity="0.8" />
            
            {/* Windmill Silhouette */}
            <rect x="490" y="190" width="30" height="50" fill="#f8fafc" />
            <circle cx="505" cy="190" r="8" fill="#e2e8f0" />
            <line x1="505" y1="190" x2="480" y2="165" stroke="#cbd5e1" strokeWidth="2" />
            <line x1="505" y1="190" x2="530" y2="215" stroke="#cbd5e1" strokeWidth="2" />
          </svg>
          <div className="absolute bottom-4 left-5 text-white/90">
            <span className="text-xs uppercase tracking-widest text-sky-300 font-medium">Oia Caldera & Sunset</span>
          </div>
        </div>
      );

    case 'hotel-paris-marais':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-stone-950 via-rose-950/60 to-neutral-900 flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-300/15 via-transparent to-black/60" />
          <svg className="absolute inset-0 w-full h-full opacity-80" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Haussmannian Mansard Roof & Dormers */}
            <polygon points="60,180 180,120 480,120 540,180" fill="#334155" />
            <rect x="100" y="180" width="400" height="180" fill="#292524" />
            
            {/* French Zinc Dormer Windows */}
            <rect x="180" y="135" width="35" height="40" rx="6" fill="#fef08a" fillOpacity="0.75" />
            <rect x="280" y="135" width="35" height="40" rx="6" fill="#fef08a" fillOpacity="0.75" />
            <rect x="380" y="135" width="35" height="40" rx="6" fill="#fef08a" fillOpacity="0.75" />
            
            {/* French Balcony Railings */}
            <line x1="120" y1="240" x2="480" y2="240" stroke="#a8a29e" strokeWidth="3" />
            <line x1="120" y1="260" x2="480" y2="260" stroke="#78716c" strokeWidth="2" />
            {/* French Windows */}
            {[0, 1, 2, 3].map((col) => (
              <rect key={col} x={150 + col * 85} y="200" width="32" height="55" rx="3" fill="#fde68a" fillOpacity="0.7" />
            ))}
            
            {/* Courtyard Tree Silhouette */}
            <circle cx="80" cy="300" r="45" fill="#1c1917" />
          </svg>
          <div className="absolute bottom-4 left-5 text-white/90">
            <span className="text-xs uppercase tracking-widest text-rose-300 font-medium">Hôtel Particulier Le Marais</span>
          </div>
        </div>
      );

    case 'hotel-bali-ubud':
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-950 to-stone-950 flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-black/70" />
          <svg className="absolute inset-0 w-full h-full opacity-85" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Tropical Rainforest Palms & Canopies */}
            <circle cx="100" cy="180" r="80" fill="#064e3b" fillOpacity="0.7" />
            <circle cx="480" cy="170" r="90" fill="#064e3b" fillOpacity="0.7" />
            
            {/* Terraced Rice Paddies & River Gorge */}
            <path d="M0 260 Q150 240 300 270 T600 250 L600 400 L0 400 Z" fill="#065f46" fillOpacity="0.6" />
            <path d="M0 310 Q200 290 400 320 T600 300 L600 400 L0 400 Z" fill="#047857" fillOpacity="0.4" />
            
            {/* Curved Bamboo Shala Villa Pavilion */}
            <path d="M190 220 Q300 150 410 220 L400 270 Q300 230 200 270 Z" fill="#78350f" fillOpacity="0.9" />
            <rect x="230" y="260" width="140" height="60" fill="#451a03" fillOpacity="0.85" />
            
            {/* Floating Pool over Ayung River */}
            <rect x="220" y="320" width="160" height="30" rx="8" fill="#14b8a6" fillOpacity="0.75" />
            
            {/* Warm Lanterns */}
            <circle cx="260" cy="275" r="5" fill="#fef08a" />
            <circle cx="340" cy="275" r="5" fill="#fef08a" />
          </svg>
          <div className="absolute bottom-4 left-5 text-white/90">
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-medium">Ayung Rainforest Sanctuary</span>
          </div>
        </div>
      );

    case 'hotel-maui-wailea':
    default:
      return (
        <div className={`relative overflow-hidden bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-900 flex items-center justify-center ${className}`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/20 via-sky-600/15 to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-85" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" fill="none">
            {/* Ocean Horizon */}
            <circle cx="300" cy="180" r="60" fill="#fef08a" fillOpacity="0.75" />
            <path d="M0 240 Q150 230 300 240 T600 235 L600 400 L0 400 Z" fill="#0369a1" fillOpacity="0.6" />
            
            {/* Beach Sands & Lagoon Edge */}
            <path d="M0 310 Q250 280 600 320 L600 400 L0 400 Z" fill="#d97706" fillOpacity="0.4" />
            
            {/* Palm Trees */}
            <path d="M120 330 Q140 230 110 160" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
            <circle cx="110" cy="155" r="35" fill="#065f46" fillOpacity="0.85" />
            
            {/* Beach Cabana & Fire Pit */}
            <polygon points="380,260 440,210 500,260" fill="#451a03" />
            <rect x="400" y="260" width="80" height="50" fill="#78350f" fillOpacity="0.8" />
            <circle cx="340" cy="310" r="8" fill="#f97316" fillOpacity="0.9" />
          </svg>
          <div className="absolute bottom-4 left-5 text-white/90">
            <span className="text-xs uppercase tracking-widest text-cyan-300 font-medium">Wailea Beachfront Cabana</span>
          </div>
        </div>
      );
  }
};
