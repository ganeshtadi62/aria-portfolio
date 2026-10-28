import React, { useEffect, useState } from 'react'
import { useActiveSection } from '../hooks.js'

const LINKS = [
  ['about', 'About'],
  ['work', 'Work'],
  ['experience', 'Experience'],
  ['contact', 'Contact'],
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection(LINKS.map(([id]) => id))

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="wrap">
        <a href="#top" className="logo" onClick={() => setOpen(false)}>
          Aria<span>.</span>
        </a>
        <ul className={`links ${open ? 'open' : ''}`}>
          {LINKS.map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <button className="burger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  )
}
