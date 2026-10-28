import React, { useEffect, useMemo, useState } from 'react'
import { projects } from '../data/content.js'
import { useReveal } from '../hooks.js'
import Shapes from './Shapes.jsx'

const FILTERS = ['All', 'Web', 'Mobile', 'Brand', 'Tools']
const MATCH = {
  All: () => true,
  Web: (p) => /web|marketing/i.test(p.category),
  Mobile: (p) => /mobile/i.test(p.category),
  Brand: (p) => /brand/i.test(p.category),
  Tools: (p) => /tools/i.test(p.category),
}

function Card({ p, onOpen }) {
  const [ref, shown] = useReveal({ threshold: 0.1 })
  return (
    <article
      ref={ref}
      className={`card reveal ${shown ? 'in' : ''}`}
      style={{ '--accent': p.accent }}
      onClick={() => onOpen(p)}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(p)}
    >
      <div className="thumb">
        <span className="no">{p.id}</span>
        <Shapes kind={p.shape} accent={p.accent} />
        <span className="view">View</span>
      </div>
      <div className="card-info">
        <div>
          <h3>{p.title}</h3>
          <div className="cat">{p.category}</div>
        </div>
        <span className="yr">{p.year}</span>
      </div>
      <div className="tags">
        {p.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </article>
  )
}

export default function Work() {
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(null)
  const [ref, shown] = useReveal()
  const list = useMemo(() => projects.filter(MATCH[filter]), [filter])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <section id="work">
      <div className="wrap">
        <div ref={ref} className={`work-head reveal ${shown ? 'in' : ''}`}>
          <div>
            <div className="eyebrow">02 — Selected work</div>
            <h2 className="title">
              Things I&apos;ve <em>made</em>,
              <br />
              recently.
            </h2>
          </div>
          <div className="filters">
            {FILTERS.map((f) => (
              <button key={f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="projects">
          {list.map((p) => (
            <Card key={p.id} p={p} onOpen={setOpen} />
          ))}
        </div>
      </div>

      {open && (
        <div className="modal-bg" onClick={() => setOpen(null)} role="dialog" aria-modal="true">
          <div className="modal" style={{ '--accent': open.accent }} onClick={(e) => e.stopPropagation()}>
            <div className="thumb">
              <Shapes kind={open.shape} accent={open.accent} />
            </div>
            <div className="modal-body">
              <button className="close" onClick={() => setOpen(null)}>ESC ✕</button>
              <div className="cat">
                {open.category} · {open.year}
              </div>
              <h3>{open.title}</h3>
              <p>{open.blurb}</p>
              <div className="tags" style={{ marginBottom: '1.6rem' }}>
                {open.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a href="#contact" className="btn" onClick={() => setOpen(null)}>
                Discuss a similar project <span className="arr">→</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
