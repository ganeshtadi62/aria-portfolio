import { supabase } from './supabase.js'

export const SHAPES = ['waves', 'grid', 'orbs', 'blocks']

/** Map a database row to the shape the UI components expect. */
export function fromRow(r) {
  return {
    id: r.id,
    code: r.code || '',
    position: r.position ?? 0,
    title: r.title,
    category: r.category || '',
    year: r.year || '',
    blurb: r.blurb || '',
    tags: Array.isArray(r.tags) ? r.tags : [],
    accent: r.accent || '#d4ff3a',
    shape: r.shape || 'waves',
    published: r.published !== false,
  }
}

/** Fetch projects, oldest position first. Throws on failure. */
export async function listProjects() {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data.map(fromRow)
}

function toRow(p) {
  return {
    code: p.code,
    position: Number.isFinite(p.position) ? p.position : 0,
    title: p.title.trim(),
    category: p.category.trim(),
    year: p.year.trim(),
    blurb: p.blurb.trim(),
    tags: p.tags,
    accent: p.accent,
    shape: p.shape,
    published: p.published,
  }
}

export async function createProject(p) {
  const { data, error } = await supabase.from('projects').insert(toRow(p)).select().single()
  if (error) throw error
  return fromRow(data)
}

export async function updateProject(id, p) {
  const { data, error } = await supabase.from('projects').update(toRow(p)).eq('id', id).select().single()
  if (error) throw error
  return fromRow(data)
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}
