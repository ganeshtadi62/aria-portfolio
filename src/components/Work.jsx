import React, { useEffect, useMemo, useState } from 'react'
import { useProjects } from '../lib/useProjects.js'
import { useReveal } from '../hooks.js'
import Shapes from './Shapes.jsx'

// Filter chips are derived from the data, so any category you add in /admin
// shows up automatically. A category like "Fintech · Web App" is grouped by
// its trailing keyword; add a mapping here to merge synonyms.
const GROUPS = [
  ['Web', /web|marketing|site|app/i],
  ['Mobile', /mobile|ios|android/i],
  ['Brand', /brand|identity/i],
  ['Tools', /tool|developer/i],
]

function groupsOf(p) {
  const hit = GROUPS.filter(([, re]) => re.test(p.category)).map(([name]) => name)
  return hit.length ? hit : ['Other']
}

function Card({ p, index, onOpen }) {
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
        <span className="no">{p.code || String(index + 1).padStart(2, '0')}</span>
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
  const { projects, status } = useProjects()

  const visible = useMemo(() => projects.filter((p) => p.published), [projects])
  const filters = useMemo(() => {
    const present = new Set(visible.flatMap(groupsOf))
    return ['All', ...GROUPS.map(([n]) => n).filter((n) => present.has(n)), ...(present.has('Other') ? ['Other'] : [])]
  }, [visible])
  const list = useMemo(
    () => (filter === 'All' ? visible : visible.filter((p) => groupsOf(p).includes(filter))),
    [visible, filter],
  )

  // If the active filter disappears (e.g. its last project was removed), reset.
  useEffect(() => {
    if (!filters.includes(filter)) setFilter('All')
  }, [filters, filter])

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
            {filters.map((f) => (
              <button key={f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {status === 'loading' ? (
          <div className="projects" aria-busy="true" aria-label="Loading projects">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="card skeleton" />
            ))}
          </div>
        ) : list.length === 0 ? (
          <p className="empty-note">No projects here yet.</p>
        ) : (
          <div className="projects">
            {list.map((p, i) => (
              <Card key={p.id} p={p} index={i} onOpen={setOpen} />
            ))}
          </div>
        )}
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
