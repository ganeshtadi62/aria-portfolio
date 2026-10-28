import { useCallback, useEffect, useState } from 'react'
import { projects as fallback } from '../data/content.js'
import { listProjects } from './projectsApi.js'
import { watchTable } from './liveSync.js'
import { hasSupabase } from './supabase.js'

/**
 * Loads projects from Supabase and keeps them live (database -> page).
 * Falls back to the bundled sample data if Supabase is not configured or the
 * request fails, so the page always renders.
 * status: 'loading' | 'ready' | 'fallback'
 */
export function useProjects() {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!hasSupabase) {
      setProjects(fallback.map((p) => ({ ...p, published: true })))
      setStatus('fallback')
      return
    }
    try {
      const rows = await listProjects()
      setProjects(rows)
      setStatus('ready')
      setError(null)
    } catch (e) {
      console.error('Failed to load projects from Supabase:', e)
      setError(e)
      setProjects((prev) => (prev.length ? prev : fallback.map((p) => ({ ...p, published: true }))))
      setStatus('fallback')
    }
  }, [])

  useEffect(() => {
    load()
    return watchTable('projects', load)
  }, [load])

  return { projects, status, error, reload: load }
}
