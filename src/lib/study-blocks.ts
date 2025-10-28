import { supabase } from './supabase'
import { StudyBlock } from '@/types'
import { ScheduleAlgorithm } from './schedule-algorithm'

export class StudyBlockService {
  static async getStudyBlocks(userId: string, date?: Date): Promise<StudyBlock[]> {
    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('study_blocks')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr)
      .order('start_time', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch study blocks: ${error.message}`)
    }

    return data || []
  }

  static async generateStudyBlocks(userId: string, targetDate: Date): Promise<StudyBlock[]> {
    // Import services
    const { FixedEventService } = await import('./fixed-events')
    const { LearningGoalService } = await import('./learning-goals')

    // Get fixed events and learning goal
    const fixedEvents = await FixedEventService.getFixedEvents(userId)
    const learningGoal = await LearningGoalService.getLearningGoal(userId)

    if (!learningGoal) {
      throw new Error('学習目標が設定されていません')
    }

    // Generate study blocks using the algorithm
    const algorithm = new ScheduleAlgorithm()
    const studyBlocks = algorithm.generateStudyBlocks(fixedEvents, learningGoal, targetDate)

    // Save to database
    const savedBlocks: StudyBlock[] = []
    for (const block of studyBlocks) {
      const { data, error } = await supabase
        .from('study_blocks')
        .insert({
          user_id: userId,
          subject: block.subject,
          date: block.date,
          start_time: block.start_time,
          end_time: block.end_time,
          duration: block.duration,
          is_completed: block.is_completed,
          is_skipped: block.is_skipped
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to save study block:', error)
      } else {
        savedBlocks.push(data)
      }
    }

    return savedBlocks
  }

  static async updateStudyBlock(
    blockId: string,
    updates: Partial<Pick<StudyBlock, 'is_completed' | 'is_skipped' | 'completed_at'>>
  ): Promise<StudyBlock> {
    const updateData: any = { ...updates }
    
    if (updates.is_completed && !updates.completed_at) {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('study_blocks')
      .update(updateData)
      .eq('id', blockId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update study block: ${error.message}`)
    }

    return data
  }

  static async deleteStudyBlock(blockId: string): Promise<void> {
    const { error } = await supabase
      .from('study_blocks')
      .delete()
      .eq('id', blockId)

    if (error) {
      throw new Error(`Failed to delete study block: ${error.message}`)
    }
  }

  static async markStudyBlockCompleted(blockId: string): Promise<StudyBlock> {
    return this.updateStudyBlock(blockId, {
      is_completed: true,
      completed_at: new Date().toISOString()
    })
  }

  static async markStudyBlockSkipped(blockId: string): Promise<StudyBlock> {
    return this.updateStudyBlock(blockId, {
      is_skipped: true
    })
  }

  static async getWeeklyStudyBlocks(userId: string, weekStartDate: Date): Promise<StudyBlock[]> {
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekEndDate.getDate() + 6)

    const { data, error } = await supabase
      .from('study_blocks')
      .select('*')
      .eq('user_id', userId)
      .gte('date', weekStartDate.toISOString().split('T')[0])
      .lte('date', weekEndDate.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch weekly study blocks: ${error.message}`)
    }

    return data || []
  }

  static async getStudyBlocksBySubject(userId: string, subject: string, startDate?: Date, endDate?: Date): Promise<StudyBlock[]> {
    let query = supabase
      .from('study_blocks')
      .select('*')
      .eq('user_id', userId)
      .eq('subject', subject)

    if (startDate) {
      query = query.gte('date', startDate.toISOString().split('T')[0])
    }

    if (endDate) {
      query = query.lte('date', endDate.toISOString().split('T')[0])
    }

    const { data, error } = await query.order('date', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch study blocks by subject: ${error.message}`)
    }

    return data || []
  }

  static async getStudyBlocksStats(userId: string, startDate: Date, endDate: Date): Promise<{
    totalBlocks: number
    completedBlocks: number
    skippedBlocks: number
    totalMinutes: number
    completedMinutes: number
    completionRate: number
    subjectStats: Record<string, {
      totalBlocks: number
      completedBlocks: number
      totalMinutes: number
      completedMinutes: number
      completionRate: number
    }>
  }> {
    const { data, error } = await supabase
      .from('study_blocks')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])

    if (error) {
      throw new Error(`Failed to fetch study blocks stats: ${error.message}`)
    }

    const blocks = data || []
    
    const stats = {
      totalBlocks: blocks.length,
      completedBlocks: blocks.filter(b => b.is_completed).length,
      skippedBlocks: blocks.filter(b => b.is_skipped).length,
      totalMinutes: blocks.reduce((sum, b) => sum + b.duration, 0),
      completedMinutes: blocks.filter(b => b.is_completed).reduce((sum, b) => sum + b.duration, 0),
      completionRate: 0,
      subjectStats: {} as Record<string, any>
    }

    stats.completionRate = stats.totalBlocks > 0 ? (stats.completedBlocks / stats.totalBlocks) * 100 : 0

    // Calculate subject stats
    const subjects = [...new Set(blocks.map(b => b.subject))]
    for (const subject of subjects) {
      const subjectBlocks = blocks.filter(b => b.subject === subject)
      const completedSubjectBlocks = subjectBlocks.filter(b => b.is_completed)
      
      stats.subjectStats[subject] = {
        totalBlocks: subjectBlocks.length,
        completedBlocks: completedSubjectBlocks.length,
        totalMinutes: subjectBlocks.reduce((sum, b) => sum + b.duration, 0),
        completedMinutes: completedSubjectBlocks.reduce((sum, b) => sum + b.duration, 0),
        completionRate: subjectBlocks.length > 0 ? (completedSubjectBlocks.length / subjectBlocks.length) * 100 : 0
      }
    }

    return stats
  }

  static async regenerateStudyBlocks(userId: string, targetDate: Date): Promise<StudyBlock[]> {
    // Delete existing study blocks for the target date
    const dateStr = targetDate.toISOString().split('T')[0]
    await supabase
      .from('study_blocks')
      .delete()
      .eq('user_id', userId)
      .eq('date', dateStr)

    // Generate new study blocks
    return this.generateStudyBlocks(userId, targetDate)
  }
}




import { StudyBlock } from '@/types'
import { ScheduleAlgorithm } from './schedule-algorithm'

export class StudyBlockService {
  static async getStudyBlocks(userId: string, date?: Date): Promise<StudyBlock[]> {
    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('study_blocks')
      .select('*')
      .eq('user_id', userId)
      .eq('date', dateStr)
      .order('start_time', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch study blocks: ${error.message}`)
    }

    return data || []
  }

  static async generateStudyBlocks(userId: string, targetDate: Date): Promise<StudyBlock[]> {
    // Import services
    const { FixedEventService } = await import('./fixed-events')
    const { LearningGoalService } = await import('./learning-goals')

    // Get fixed events and learning goal
    const fixedEvents = await FixedEventService.getFixedEvents(userId)
    const learningGoal = await LearningGoalService.getLearningGoal(userId)

    if (!learningGoal) {
      throw new Error('学習目標が設定されていません')
    }

    // Generate study blocks using the algorithm
    const algorithm = new ScheduleAlgorithm()
    const studyBlocks = algorithm.generateStudyBlocks(fixedEvents, learningGoal, targetDate)

    // Save to database
    const savedBlocks: StudyBlock[] = []
    for (const block of studyBlocks) {
      const { data, error } = await supabase
        .from('study_blocks')
        .insert({
          user_id: userId,
          subject: block.subject,
          date: block.date,
          start_time: block.start_time,
          end_time: block.end_time,
          duration: block.duration,
          is_completed: block.is_completed,
          is_skipped: block.is_skipped
        })
        .select()
        .single()

      if (error) {
        console.error('Failed to save study block:', error)
      } else {
        savedBlocks.push(data)
      }
    }

    return savedBlocks
  }

  static async updateStudyBlock(
    blockId: string,
    updates: Partial<Pick<StudyBlock, 'is_completed' | 'is_skipped' | 'completed_at'>>
  ): Promise<StudyBlock> {
    const updateData: any = { ...updates }
    
    if (updates.is_completed && !updates.completed_at) {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('study_blocks')
      .update(updateData)
      .eq('id', blockId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update study block: ${error.message}`)
    }

    return data
  }

  static async deleteStudyBlock(blockId: string): Promise<void> {
    const { error } = await supabase
      .from('study_blocks')
      .delete()
      .eq('id', blockId)

    if (error) {
      throw new Error(`Failed to delete study block: ${error.message}`)
    }
  }

  static async markStudyBlockCompleted(blockId: string): Promise<StudyBlock> {
    return this.updateStudyBlock(blockId, {
      is_completed: true,
      completed_at: new Date().toISOString()
    })
  }

  static async markStudyBlockSkipped(blockId: string): Promise<StudyBlock> {
    return this.updateStudyBlock(blockId, {
      is_skipped: true
    })
  }

  static async getWeeklyStudyBlocks(userId: string, weekStartDate: Date): Promise<StudyBlock[]> {
    const weekEndDate = new Date(weekStartDate)
    weekEndDate.setDate(weekEndDate.getDate() + 6)

    const { data, error } = await supabase
      .from('study_blocks')
      .select('*')
      .eq('user_id', userId)
      .gte('date', weekStartDate.toISOString().split('T')[0])
      .lte('date', weekEndDate.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch weekly study blocks: ${error.message}`)
    }

    return data || []
  }

  static async getStudyBlocksBySubject(userId: string, subject: string, startDate?: Date, endDate?: Date): Promise<StudyBlock[]> {
    let query = supabase
      .from('study_blocks')
      .select('*')
      .eq('user_id', userId)
      .eq('subject', subject)

    if (startDate) {
      query = query.gte('date', startDate.toISOString().split('T')[0])
    }

    if (endDate) {
      query = query.lte('date', endDate.toISOString().split('T')[0])
    }

    const { data, error } = await query.order('date', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch study blocks by subject: ${error.message}`)
    }

    return data || []
  }

  static async getStudyBlocksStats(userId: string, startDate: Date, endDate: Date): Promise<{
    totalBlocks: number
    completedBlocks: number
    skippedBlocks: number
    totalMinutes: number
    completedMinutes: number
    completionRate: number
    subjectStats: Record<string, {
      totalBlocks: number
      completedBlocks: number
      totalMinutes: number
      completedMinutes: number
      completionRate: number
    }>
  }> {
    const { data, error } = await supabase
      .from('study_blocks')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])

    if (error) {
      throw new Error(`Failed to fetch study blocks stats: ${error.message}`)
    }

    const blocks = data || []
    
    const stats = {
      totalBlocks: blocks.length,
      completedBlocks: blocks.filter(b => b.is_completed).length,
      skippedBlocks: blocks.filter(b => b.is_skipped).length,
      totalMinutes: blocks.reduce((sum, b) => sum + b.duration, 0),
      completedMinutes: blocks.filter(b => b.is_completed).reduce((sum, b) => sum + b.duration, 0),
      completionRate: 0,
      subjectStats: {} as Record<string, any>
    }

    stats.completionRate = stats.totalBlocks > 0 ? (stats.completedBlocks / stats.totalBlocks) * 100 : 0

    // Calculate subject stats
    const subjects = [...new Set(blocks.map(b => b.subject))]
    for (const subject of subjects) {
      const subjectBlocks = blocks.filter(b => b.subject === subject)
      const completedSubjectBlocks = subjectBlocks.filter(b => b.is_completed)
      
      stats.subjectStats[subject] = {
        totalBlocks: subjectBlocks.length,
        completedBlocks: completedSubjectBlocks.length,
        totalMinutes: subjectBlocks.reduce((sum, b) => sum + b.duration, 0),
        completedMinutes: completedSubjectBlocks.reduce((sum, b) => sum + b.duration, 0),
        completionRate: subjectBlocks.length > 0 ? (completedSubjectBlocks.length / subjectBlocks.length) * 100 : 0
      }
    }

    return stats
  }

  static async regenerateStudyBlocks(userId: string, targetDate: Date): Promise<StudyBlock[]> {
    // Delete existing study blocks for the target date
    const dateStr = targetDate.toISOString().split('T')[0]
    await supabase
      .from('study_blocks')
      .delete()
      .eq('user_id', userId)
      .eq('date', dateStr)

    // Generate new study blocks
    return this.generateStudyBlocks(userId, targetDate)
  }
}



