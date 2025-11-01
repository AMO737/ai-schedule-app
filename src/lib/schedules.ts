import { supabase } from '@/lib/supabase'
import { Schedule } from '@/types'

/**
 * Load today's schedules for a user (JST timezone)
 */
export async function loadTodaySchedules(userId: string) {
  // Get today's date range in JST
  const start = new Date()
  // Set to JST midnight (UTC+9)
  start.setHours(0, 0, 0, 0)
  // Convert JST to UTC for query
  const jstOffset = 9 * 60 // JST is UTC+9
  const jstStart = new Date(start.getTime() - jstOffset * 60 * 1000)
  
  const end = new Date()
  end.setHours(23, 59, 59, 999)
  const jstEnd = new Date(end.getTime() - jstOffset * 60 * 1000)
  
  console.log('[loadTodaySchedules] JST Date range:', {
    start: jstStart.toISOString(),
    end: jstEnd.toISOString(),
    localStart: start.toISOString().split('T')[0],
    localEnd: end.toISOString().split('T')[0]
  })

  const { data, error } = await supabase
    .from("schedules")
    .select("*")
    .eq("user_id", userId)
    .gte("start_at", jstStart.toISOString())
    .lte("start_at", jstEnd.toISOString())
    .order("start_at", { ascending: true })

  if (error) {
    console.error('[loadTodaySchedules] Error:', error)
    return { data: null, error }
  }

  console.log('[loadTodaySchedules] Loaded', data?.length || 0, 'schedules')
  return { data, error: null }
}

/**
 * Insert a new schedule
 */
export async function insertSchedule(schedule: Omit<Schedule, 'id' | 'created_at' | 'updated_at'>) {
  console.log('[insertSchedule] Inserting:', schedule)
  
  const { data, error } = await supabase
    .from("schedules")
    .insert([schedule])
    .select()
    .single()

  if (error) {
    console.error('[insertSchedule] Error:', error)
    return { data: null, error }
  }

  console.log('[insertSchedule] Inserted:', data)
  return { data, error: null }
}

/**
 * Update schedule completion status
 */
export async function updateScheduleDone(id: string, isDone: boolean, userId: string) {
  console.log('[updateScheduleDone] Updating:', { id, isDone })
  
  const { data, error } = await supabase
    .from("schedules")
    .update({ is_done: isDone, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    console.error('[updateScheduleDone] Error:', error)
    return { data: null, error }
  }

  console.log('[updateScheduleDone] Updated:', data)
  return { data, error: null }
}

