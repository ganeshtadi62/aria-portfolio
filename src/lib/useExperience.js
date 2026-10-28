import { useCallback, useEffect, useState } from 'react'
import { experience as fallback } from '../data/content.js'
import { listExperience } from './experienceApi.js'
import { watchTable } from './liveSync.js'
import { hasSupabase } from './supabase.js'

const sample = () => fallback.map((j, i) => ({ ...j, id: `sample-${i}`, position: i + 1, published: true }))

/**
 * Loads experience from Supabase and keeps it live (database -> page).
 * Falls back to the bundled sample data if Supabase is not configured or the
 * request fails, so the section always renders.
 * status: 'loading' | 'ready' | 'fallback'
 */
export function useExperience() {
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')

  const load = useCallback(async () => {
    if (!hasSupabase) {
      setItems(sample())
      setStatus('fallback')
      return
    }
    try {
      setItems(await listExperience())
      setStatus('ready')
    } catch (e) {
      console.error('Failed to load experience from Supabase:', e)
      setItems((prev) => (prev.length ? prev : sample()))
      setStatus('fallback')
    }
  }, [])

  useEffect(() => {
    load()
    return watchTable('experience', load)
  }, [load])

  return { items, status, reload: load }
}
