import React, { useCallback, useEffect, useState } from 'react'
import { supabase, hasSupabase } from '../lib/supabase.js'
import { SHAPES, createProject, deleteProject, listProjects, updateProject } from '../lib/projectsApi.js'
import Shapes from './Shapes.jsx'

const EMPTY = {
  title: '',
  category: '',
  year: String(new Date().getFullYear()),
  blurb: '',
  tags: '',
  accent: '#d4ff3a',
  shape: 'waves',
  published: true,
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr(error.message)
    setBusy(false)
  }

  return (
    <form className="adm-card adm-login" onSubmit={submit}>
      <div className="eyebrow">Admin</div>
      <h1 className="adm-title">
        Sign <em>in</em>
      </h1>
      <label className="adm-field">
        <span>Email</span>
        <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="adm-field">
        <span>Password</span>
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      {err && <p className="adm-err" role="alert">{err}</p>}
      <button className="btn" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'} <span className="arr">→</span>
      </button>
      <a className="adm-back" href="/">← Back to site</a>
    </form>
  )
}

function ProjectForm({ initial, onSave, onCancel, saving }) {
  const [f, setF] = useState(initial)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const tags = f.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 8)
    onSave({ ...f, tags })
  }

  return (
    <form className="adm-card adm-form" onSubmit={submit}>
      <h2 className="adm-h2">{initial.id ? 'Edit project' : 'Add project'}</h2>

      <label className="adm-field">
        <span>Title *</span>
        <input required maxLength={80} value={f.title} onChange={set('title')} placeholder="Tidewater" />
      </label>
      <div className="adm-row">
        <label className="adm-field">
          <span>Category</span>
          <input maxLength={80} value={f.category} onChange={set('category')} placeholder="Fintech · Web App" />
        </label>
        <label className="adm-field adm-narrow">
          <span>Year</span>
          <input maxLength={10} value={f.year} onChange={set('year')} />
        </label>
      </div>
      <label className="adm-field">
        <span>Description</span>
        <textarea rows={4} maxLength={600} value={f.blurb} onChange={set('blurb')} />
      </label>
      <label className="adm-field">
        <span>Tags (comma separated)</span>
        <input value={f.tags} onChange={set('tags')} placeholder="React, D3, Design System" />
      </label>

      <div className="adm-row">
        <label className="adm-field">
          <span>Artwork</span>
          <select value={f.shape} onChange={set('shape')}>
            {SHAPES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="adm-field adm-narrow">
          <span>Accent</span>
          <input type="color" value={f.accent} onChange={set('accent')} />
        </label>
        <label className="adm-check">
          <input type="checkbox" checked={f.published} onChange={set('published')} />
          <span>Published</span>
        </label>
      </div>

      <div className="adm-preview" style={{ '--accent': f.accent }}>
        <Shapes kind={f.shape} accent={f.accent} />
      </div>

      <div className="adm-actions">
        <button className="btn" disabled={saving}>
          {saving ? 'Saving…' : initial.id ? 'Save changes' : 'Add project'} <span className="arr">→</span>
        </button>
        {onCancel && (
          <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  )
}

function Dashboard({ session }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(null) // null | 'new' | project
  const [msg, setMsg] = useState(null) // {kind:'ok'|'err', text}

  const flash = (kind, text) => {
    setMsg({ kind, text })
    setTimeout(() => setMsg(null), 4000)
  }

  const refresh = useCallback(async () => {
    try {
      setRows(await listProjects())
    } catch (e) {
      flash('err', e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const save = async (p) => {
    setSaving(true)
    try {
      if (p.id) {
        await updateProject(p.id, p)
        flash('ok', 'Project updated — live on the site now.')
      } else {
        const nextPos = rows.reduce((m, r) => Math.max(m, r.position), 0) + 1
        await createProject({
          ...p,
          position: nextPos,
          code: String(nextPos).padStart(2, '0'),
        })
        flash('ok', 'Project added — live on the site now.')
      }
      setEditing(null)
      await refresh()
    } catch (e) {
      flash('err', e.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    try {
      await deleteProject(p.id)
      flash('ok', 'Project deleted.')
      await refresh()
    } catch (e) {
      flash('err', e.message)
    }
  }

  const initialFor = (p) => (p === 'new' ? EMPTY : { ...p, tags: p.tags.join(', ') })

  return (
    <div className="adm-wrap">
      <header className="adm-head">
        <div>
          <div className="eyebrow">Admin</div>
          <h1 className="adm-title">
            Your <em>projects</em>
          </h1>
          <p className="adm-sub">Signed in as {session.user.email}</p>
        </div>
        <div className="adm-actions">
          <a className="btn ghost" href="/">View site</a>
          <button className="btn ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </header>

      {msg && (
        <div className={`adm-toast ${msg.kind}`} role="status">{msg.text}</div>
      )}

      {editing ? (
        <ProjectForm
          key={editing === 'new' ? 'new' : editing.id}
          initial={initialFor(editing)}
          saving={saving}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <>
          <button className="btn" onClick={() => setEditing('new')}>
            + Add project <span className="arr">→</span>
          </button>
          <div className="adm-list">
            {loading && <p className="adm-sub">Loading…</p>}
            {!loading && rows.length === 0 && <p className="adm-sub">No projects yet. Add your first one.</p>}
            {rows.map((p) => (
              <div key={p.id} className="adm-item" style={{ '--accent': p.accent }}>
                <div className="adm-thumb">
                  <Shapes kind={p.shape} accent={p.accent} />
                </div>
                <div className="adm-meta">
                  <strong>{p.title}</strong>
                  <span>
                    {p.category || '—'} · {p.year}
                    {!p.published && <em className="adm-draft"> · draft</em>}
                  </span>
                </div>
                <div className="adm-actions">
                  <button className="btn ghost" onClick={() => setEditing(p)}>Edit</button>
                  <button className="btn ghost danger" onClick={() => remove(p)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * /admin — email+password sign-in. Being signed in is NOT enough: the user must
 * also be listed in the `admins` table. The database enforces this with row-level
 * security regardless of what this UI shows, so this check is only for UX.
 */
export default function Admin() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [isAdmin, setIsAdmin] = useState(null)

  useEffect(() => {
    if (!hasSupabase) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) {
      setIsAdmin(null)
      return
    }
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => setIsAdmin(Boolean(data)))
  }, [session])

  useEffect(() => {
    document.title = 'Admin — Aria Voss'
  }, [])

  let body
  if (!hasSupabase) {
    body = (
      <div className="adm-card">
        <h1 className="adm-title">Not configured</h1>
        <p className="adm-sub">Supabase environment variables are missing from this deployment.</p>
      </div>
    )
  } else if (session === undefined) {
    body = <p className="adm-sub">Loading…</p>
  } else if (!session) {
    body = <Login />
  } else if (isAdmin === null) {
    body = <p className="adm-sub">Checking access…</p>
  } else if (!isAdmin) {
    body = (
      <div className="adm-card">
        <h1 className="adm-title">No <em>access</em></h1>
        <p className="adm-sub">
          {session.user.email} is signed in but is not an admin of this site.
        </p>
        <div className="adm-actions">
          <button className="btn ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
          <a className="btn ghost" href="/">Back to site</a>
        </div>
      </div>
    )
  } else {
    body = <Dashboard session={session} />
  }

  return <div className="adm-page">{body}</div>
}
