import { supabase } from './supabase.js'

/** Map a database row to the shape the Experience component expects. */
export function fromRow(r) {
  return {
    id: r.id,
    position: r.position ?? 0,
    period: r.period || '',
    role: r.role,
    company: r.company || '',
    detail: r.detail || '',
    published: r.published !== false,
  }
}

/** Fetch experience entries, lowest position first (position 1 = top of the timeline). */
export async function listExperience() {
  if (!supabase) throw new Error('Supabase is not configured')
  const { data, error } = await supabase
    .from('experience')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })
  if (error) throw error
  return data.map(fromRow)
}

function toRow(e) {
  const position = Number.parseInt(e.position, 10)
  return {
    position: Number.isFinite(position) ? position : 0,
    period: e.period.trim(),
    role: e.role.trim(),
    company: e.company.trim(),
    detail: e.detail.trim(),
    published: e.published,
  }
}

export async function createExperience(e) {
  const { data, error } = await supabase.from('experience').insert(toRow(e)).select().single()
  if (error) throw error
  return fromRow(data)
}

export async function updateExperience(id, e) {
  const { data, error } = await supabase.from('experience').update(toRow(e)).eq('id', id).select().single()
  if (error) throw error
  return fromRow(data)
}

export async function deleteExperience(id) {
  const { error } = await supabase.from('experience').delete().eq('id', id)
  if (error) throw error
}
