import React from 'react'
import { profile, socials } from '../data/content.js'

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <span>
          © {new Date().getFullYear()} {profile.name} — Built with React &amp; Vite
        </span>
        <div className="socials">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
