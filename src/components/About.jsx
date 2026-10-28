import React from 'react'
import { stats, skills } from '../data/content.js'
import { useReveal, useCountUp } from '../hooks.js'

function Stat({ value, suffix, label, start }) {
  const n = useCountUp(value, start)
  return (
    <div className="stat">
      <b>
        {n}
        {suffix && <sup>{suffix}</sup>}
      </b>
      <span>{label}</span>
    </div>
  )
}

export default function About() {
  const [ref, shown] = useReveal()
  const [sref, sshown] = useReveal({ threshold: 0.4 })

  return (
    <section id="about">
      <div className="wrap">
        <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
          <div className="eyebrow">01 — About</div>
          <div className="about-grid">
            <h2 className="title">
              Craft is the <em>quiet</em> difference.
            </h2>
            <div className="about-copy">
              <p>
                I&apos;m a designer who ships. For nine years I&apos;ve moved between Figma and the
                codebase, because the best interfaces are made by people who understand both the
                grid and the browser.
              </p>
              <p>
                My work sits where product strategy meets small, obsessive details — the easing
                curve on a dropdown, the rhythm of a type scale, the empty state nobody asked for
                but everybody remembers.
              </p>
              <p>
                Right now I lead design at Northlight Studio and take on a handful of independent
                projects each year.
              </p>
            </div>
          </div>
          <div className="skills">
            {skills.map((s) => (
              <div className="skill-col" key={s.group}>
                <h4>{s.group}</h4>
                <ul>
                  {s.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div ref={sref} className="stats" style={{ marginTop: '6rem' }}>
          {stats.map((s) => (
            <Stat key={s.label} {...s} start={sshown} />
          ))}
        </div>
      </div>
    </section>
  )
}
