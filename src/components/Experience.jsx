import React, { useMemo } from 'react'
import { useExperience } from '../lib/useExperience.js'
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
  const { items, status } = useExperience()
  const visible = useMemo(() => items.filter((j) => j.published), [items])

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
          {status === 'loading' ? (
            <div aria-busy="true" aria-label="Loading experience">
              {[0, 1, 2].map((i) => (
                <div key={i} className="job skeleton" />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <p className="empty-note">No experience listed yet.</p>
          ) : (
            visible.map((j, i) => <Job key={j.id} j={j} i={i} />)
          )}
        </div>
      </div>
    </section>
  )
}
