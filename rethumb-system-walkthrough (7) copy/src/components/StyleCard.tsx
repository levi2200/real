// StyleCard.tsx — Premium glowing style picker card

import Icon from "./Icons";

interface StyleCardProps {
  id: string;
  icon: string;
  name: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}

export default function StyleCard({ icon, name, desc, selected, onClick }: StyleCardProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative group p-4 rounded-xl border transition-all duration-300 text-left card-glow
        ${
          selected
            ? "border-orange-500/60 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-transparent shadow-lg shadow-orange-500/15 scale-[1.03]"
            : "border-white/[0.06] bg-white/[0.02] hover:border-orange-500/20 hover:bg-white/[0.04]"
        }
      `}
    >
      {/* Shimmer overlay when selected */}
      {selected && (
        <div className="absolute inset-0 rounded-xl shimmer pointer-events-none" />
      )}

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/40 z-10">
          <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Icon */}
      <div className={`mb-2.5 transition-colors duration-300 ${selected ? "text-orange-400" : "text-gray-500 group-hover:text-orange-400/70"}`}>
        <Icon name={icon as any} size={26} />
      </div>

      {/* Text */}
      <h3 className={`font-bold text-sm mb-1 transition-colors duration-300 ${selected ? "text-orange-400" : "text-gray-200 group-hover:text-white"}`}>
        {name}
      </h3>
      <p className={`text-xs leading-relaxed transition-colors duration-300 ${selected ? "text-gray-400" : "text-gray-600 group-hover:text-gray-400"}`}>
        {desc}
      </p>

      {/* Bottom gradient line when selected */}
      {selected && (
        <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent rounded-full" />
      )}
    </button>
  );
}
