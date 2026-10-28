import React from 'react'
import { experience } from '../data/content.js'
import { useReveal } from '../hooks.js'

function Job({ j, i }) {
  const [ref, shown] = useReveal({ threshold: 0.2 })
  return (
    <div
      ref={ref}
      className={`job reveal ${shown ? 'in' : ''}`}
      style={{ transitionDelay: `${i * 60}ms` }}
    >
      <div className="per">{j.period}</div>
      <h3>
        {j.role}
        <small>{j.company}</small>
      </h3>
      <p>{j.detail}</p>
    </div>
  )
}

export default function Experience() {
  const [ref, shown] = useReveal()
  return (
    <section id="experience">
      <div className="wrap">
        <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
          <div className="eyebrow">03 — Experience</div>
          <h2 className="title">
            A decade of <em>doing</em>
            <br />
            the work.
          </h2>
        </div>
        <div className="timeline">
          {experience.map((j, i) => (
            <Job key={j.period} j={j} i={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
