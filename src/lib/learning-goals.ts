import { LearningGoal } from '@/types'

export const LearningGoalService = {
  async get(_userId: string): Promise<LearningGoal | null> {
    // デモモード: UI 側から渡されるのでここでは null
    return null
  },
  async save(_userId: string, _goal: Omit<LearningGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<LearningGoal> {
    throw new Error('Not implemented in demo mode')
  },
  async delete(_goalId: string): Promise<void> {
    // デモモード: NOOP
  }
}