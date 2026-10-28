import React, { useState } from 'react'
import { profile } from '../data/content.js'
import { useReveal } from '../hooks.js'

export default function Contact() {
  const [ref, shown] = useReveal()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // Demo only: opens the visitor's mail client with the message prefilled.
    const subject = encodeURIComponent(`Project enquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <div ref={ref} className={`reveal ${shown ? 'in' : ''}`}>
          <div className="eyebrow">04 — Contact</div>
          <h2 className="title">
            Have something <em>worth</em> building?
          </h2>
          <a className="mail" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>

          {sent ? (
            <div className="sent">
              ✓ Thanks, {form.name || 'friend'} — your mail app should open with the message ready to send.
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <div className="field">
                <input id="n" required placeholder=" " value={form.name} onChange={set('name')} />
                <label htmlFor="n">Your name</label>
              </div>
              <div className="field">
                <input id="e" type="email" required placeholder=" " value={form.email} onChange={set('email')} />
                <label htmlFor="e">Email address</label>
              </div>
              <div className="field full">
                <textarea id="m" rows="4" required placeholder=" " value={form.message} onChange={set('message')} />
                <label htmlFor="m">Tell me about the project</label>
              </div>
              <div className="full">
                <button type="submit" className="btn">
                  Send message <span className="arr">→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
