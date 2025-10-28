import { FixedEvent } from '@/types'

export const FixedEventService = {
  async list(_userId: string): Promise<FixedEvent[]> {
    // デモモード: 空リスト
    return []
  },
  async create(_userId: string, _event: Omit<FixedEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<FixedEvent> {
    // デモモード: 呼び出し元で生成するためここではダミー
    throw new Error('Not implemented in demo mode')
  },
  async update(_eventId: string, _partial: Partial<FixedEvent>): Promise<void> {
    // デモモード: NOOP
  },
  async remove(_eventId: string): Promise<void> {
    // デモモード: NOOP
  }
}