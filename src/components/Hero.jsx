import React from 'react'
import { profile } from '../data/content.js'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-grid">
          <h1>
            <span className="line"><span>Designing</span></span>
            <span className="line"><span>with <em>code</em> &amp;</span></span>
            <span className="line"><span>intention.</span></span>
          </h1>
          <div className="hero-side">
            <div className="avail"><i /> {profile.availability}</div>
            <p>{profile.intro}</p>
            <a href="#work" className="btn">
              See selected work <span className="arr">→</span>
            </a>
          </div>
        </div>
        <div className="meta-row">
          <span>{profile.name}</span>
          <span>{profile.role}</span>
          <span>{profile.location}</span>
        </div>
      </div>
      <div className="scroll-hint">SCROLL</div>
    </section>
  )
}
