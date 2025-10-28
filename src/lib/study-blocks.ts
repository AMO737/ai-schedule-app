import { StudyBlock } from '@/types'

export const StudyBlockService = {
  async getStudyBlocks(userId: string, date: Date): Promise<StudyBlock[]> {
    // デモモード: 今日は空データを返す
    return []
  },

  async markStudyBlockCompleted(_blockId: string): Promise<void> {
    // デモモード: 何もしない（呼び出し元で状態更新）
  },

  async markStudyBlockSkipped(_blockId: string): Promise<void> {
    // デモモード: 何もしない（呼び出し元で状態更新）
  },
}