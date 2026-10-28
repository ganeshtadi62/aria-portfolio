import React from 'react'

/** Generative SVG artwork used as project thumbnails (no external images needed). */
export default function Shapes({ kind, accent }) {
  const common = { viewBox: '0 0 400 310', preserveAspectRatio: 'xMidYMid slice', 'aria-hidden': true }

  if (kind === 'waves') {
    return (
      <svg {...common}>
        <rect width="400" height="310" fill="#14120d" />
        {Array.from({ length: 14 }).map((_, i) => (
          <path
            key={i}
            d={`M-20 ${60 + i * 18} C 60 ${20 + i * 18}, 120 ${110 + i * 18}, 200 ${60 + i * 18} S 340 ${10 + i * 18}, 420 ${70 + i * 18}`}
            fill="none"
            stroke={accent}
            strokeOpacity={0.15 + i * 0.055}
            strokeWidth="1.4"
          />
        ))}
      </svg>
    )
  }

  if (kind === 'grid') {
    return (
      <svg {...common}>
        <rect width="400" height="310" fill="#17120d" />
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 12 }).map((__, c) => {
            const on = (r * 7 + c * 3) % 5 === 0
            return (
              <rect
                key={`${r}-${c}`}
                x={20 + c * 31}
                y={22 + r * 31}
                width="22"
                height="22"
                rx={on ? 11 : 3}
                fill={on ? accent : 'none'}
                stroke={accent}
                strokeOpacity={on ? 0 : 0.28}
              />
            )
          })
        )}
      </svg>
    )
  }

  if (kind === 'orbs') {
    return (
      <svg {...common}>
        <defs>
          <radialGradient id="o1" cx="35%" cy="35%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.95" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.05" />
          </radialGradient>
        </defs>
        <rect width="400" height="310" fill="#0d1318" />
        <circle cx="140" cy="150" r="105" fill="url(#o1)" />
        <circle cx="270" cy="120" r="62" fill="none" stroke={accent} strokeOpacity="0.5" />
        <circle cx="270" cy="120" r="38" fill={accent} fillOpacity="0.18" />
        <circle cx="300" cy="230" r="22" fill={accent} fillOpacity="0.55" />
        <circle cx="70" cy="60" r="8" fill={accent} />
      </svg>
    )
  }

  return (
    <svg {...common}>
      <rect width="400" height="310" fill="#150f18" />
      <rect x="40" y="40" width="150" height="150" fill={accent} fillOpacity="0.85" />
      <rect x="150" y="100" width="170" height="170" fill="none" stroke={accent} strokeWidth="1.5" />
      <rect x="230" y="30" width="110" height="110" fill={accent} fillOpacity="0.2" />
      <rect x="60" y="210" width="80" height="60" fill="none" stroke={accent} strokeOpacity="0.5" />
    </svg>
  )
}
