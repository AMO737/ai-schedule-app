import { supabase } from './supabase'
import { FixedEvent } from '@/types'

export class FixedEventService {
  static async getFixedEvents(userId: string): Promise<FixedEvent[]> {
    const { data, error } = await supabase
      .from('fixed_events')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch fixed events: ${error.message}`)
    }

    return data || []
  }

  static async createFixedEvent(
    userId: string,
    eventData: Omit<FixedEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<FixedEvent> {
    const { data, error } = await supabase
      .from('fixed_events')
      .insert({
        user_id: userId,
        ...eventData
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create fixed event: ${error.message}`)
    }

    return data
  }

  static async updateFixedEvent(
    eventId: string,
    eventData: Partial<Omit<FixedEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<FixedEvent> {
    const { data, error } = await supabase
      .from('fixed_events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update fixed event: ${error.message}`)
    }

    return data
  }

  static async deleteFixedEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('fixed_events')
      .delete()
      .eq('id', eventId)

    if (error) {
      throw new Error(`Failed to delete fixed event: ${error.message}`)
    }
  }

  static async toggleFixedEventStatus(eventId: string, isActive: boolean): Promise<FixedEvent> {
    return this.updateFixedEvent(eventId, { is_active: isActive })
  }

  static async getFixedEventsByDay(userId: string, dayOfWeek: number): Promise<FixedEvent[]> {
    const { data, error } = await supabase
      .from('fixed_events')
      .select('*')
      .eq('user_id', userId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .order('start_time', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch fixed events by day: ${error.message}`)
    }

    return data || []
  }
}




import { FixedEvent } from '@/types'

export class FixedEventService {
  static async getFixedEvents(userId: string): Promise<FixedEvent[]> {
    const { data, error } = await supabase
      .from('fixed_events')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch fixed events: ${error.message}`)
    }

    return data || []
  }

  static async createFixedEvent(
    userId: string,
    eventData: Omit<FixedEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<FixedEvent> {
    const { data, error } = await supabase
      .from('fixed_events')
      .insert({
        user_id: userId,
        ...eventData
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create fixed event: ${error.message}`)
    }

    return data
  }

  static async updateFixedEvent(
    eventId: string,
    eventData: Partial<Omit<FixedEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<FixedEvent> {
    const { data, error } = await supabase
      .from('fixed_events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update fixed event: ${error.message}`)
    }

    return data
  }

  static async deleteFixedEvent(eventId: string): Promise<void> {
    const { error } = await supabase
      .from('fixed_events')
      .delete()
      .eq('id', eventId)

    if (error) {
      throw new Error(`Failed to delete fixed event: ${error.message}`)
    }
  }

  static async toggleFixedEventStatus(eventId: string, isActive: boolean): Promise<FixedEvent> {
    return this.updateFixedEvent(eventId, { is_active: isActive })
  }

  static async getFixedEventsByDay(userId: string, dayOfWeek: number): Promise<FixedEvent[]> {
    const { data, error } = await supabase
      .from('fixed_events')
      .select('*')
      .eq('user_id', userId)
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .order('start_time', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch fixed events by day: ${error.message}`)
    }

    return data || []
  }
}



