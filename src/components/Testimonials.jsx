import React, { useEffect, useState } from 'react'
import { testimonials } from '../data/content.js'
import { useReveal } from '../hooks.js'

export default function Testimonials() {
  const [i, setI] = useState(0)
  const [ref, shown] = useReveal()

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % testimonials.length), 7000)
    return () => clearInterval(t)
  }, [i])

  const t = testimonials[i]
  return (
    <section className="quotes" aria-label="Testimonials">
      <div className="wrap">
        <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
          <div className="eyebrow">Kind words</div>
          <div className="quote-box">
            <blockquote key={i}>{t.quote}</blockquote>
            <div className="who">
              <b>{t.name}</b> — {t.title}
            </div>
          </div>
          <div className="dots">
            {testimonials.map((_, n) => (
              <button
                key={n}
                className={n === i ? 'on' : ''}
                onClick={() => setI(n)}
                aria-label={`Show testimonial ${n + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
