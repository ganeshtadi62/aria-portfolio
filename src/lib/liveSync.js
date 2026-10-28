import { supabase } from './supabase.js'

/**
 * Two-way sync helper. Writes go app -> database through the API modules;
 * this is the other direction, database -> app: whenever a row in `table` is
 * inserted, updated or deleted (from /admin, another browser, or the Supabase
 * dashboard) `onChange` is called so the caller can re-fetch.
 *
 * Re-fetching (instead of patching local state from the event payload) keeps
 * ordering and row-level-security rules authoritative, and it also covers
 * events missed while the tab was in the background — so we re-fetch when the
 * tab becomes visible again.
 *
 * Realtime applies row-level security to every event, so a change that makes a
 * row INVISIBLE to the viewer (e.g. un-publishing it, for anonymous visitors)
 * is never delivered. A slow visibility-gated poll covers that gap.
 * Returns an unsubscribe function.
 */
const POLL_MS = 20000

export function watchTable(table, onChange) {
  if (!supabase) return () => {}

  let timer
  const bump = () => {
    clearTimeout(timer)
    timer = setTimeout(onChange, 200) // collapse bursts of events into one fetch
  }

  const channel = supabase
    .channel(`live-${table}-${Math.random().toString(36).slice(2)}`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, bump)
    .subscribe()

  const onVisible = () => {
    if (document.visibilityState === 'visible') bump()
  }
  document.addEventListener('visibilitychange', onVisible)
  const poll = setInterval(onVisible, POLL_MS)

  return () => {
    clearTimeout(timer)
    clearInterval(poll)
    document.removeEventListener('visibilitychange', onVisible)
    supabase.removeChannel(channel)
  }
}
