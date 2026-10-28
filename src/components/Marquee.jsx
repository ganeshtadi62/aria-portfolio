import React from 'react'
import { marquee } from '../data/content.js'

export default function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((m, i) => (
          <div className="marquee-item" key={i}>{m}</div>
        ))}
      </div>
    </div>
  )
}
