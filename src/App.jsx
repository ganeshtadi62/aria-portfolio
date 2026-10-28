import React, { useEffect, useRef } from 'react'
import { useScrollProgress } from './hooks.js'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Work from './components/Work.jsx'
import Experience from './components/Experience.jsx'
import Testimonials from './components/Testimonials.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'
import Admin from './components/Admin.jsx'

function Site() {
  const progress = useScrollProgress()
  const glow = useRef(null)

  // Soft lime light that trails the cursor (desktop only).
  useEffect(() => {
    const el = glow.current
    if (!el || window.matchMedia('(pointer: coarse)').matches) return
    let x = window.innerWidth / 2
    let y = window.innerHeight / 3
    let tx = x
    let ty = y
    let raf
    const move = (e) => {
      tx = e.clientX
      ty = e.clientY
    }
    const loop = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      el.style.transform = `translate(${x - 260}px, ${y - 260}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="progress" style={{ transform: `scaleX(${progress})` }} />
      <div className="glow" ref={glow} />
      <div className="grain" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Work />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

/** Tiny path switch (no router dependency): /admin shows the editor, everything else the site. */
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '/admin' ? <Admin /> : <Site />
}
