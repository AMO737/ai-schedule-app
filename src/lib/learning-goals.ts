import { supabase } from './supabase'
import { LearningGoal, SubjectDistribution } from '@/types'

export class LearningGoalService {
  static async getLearningGoal(userId: string): Promise<LearningGoal | null> {
    const { data, error } = await supabase
      .from('learning_goals')
      .select(`
        *,
        subject_distributions (*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // No active learning goal found
      }
      throw new Error(`Failed to fetch learning goal: ${error.message}`)
    }

    // Transform the data to match our interface
    const goal: LearningGoal = {
      id: data.id,
      user_id: data.user_id,
      weekly_hours: data.weekly_hours,
      block_duration: data.block_duration,
      wake_up_time: data.wake_up_time,
      sleep_time: data.sleep_time,
      break_duration: data.break_duration,
      is_active: data.is_active,
      created_at: data.created_at,
      updated_at: data.updated_at,
      subject_distribution: data.subject_distributions.map((dist: any) => ({
        subject: dist.subject,
        percentage: dist.percentage
      }))
    }

    return goal
  }

  static async createLearningGoal(
    userId: string,
    goalData: Omit<LearningGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<LearningGoal> {
    // First, deactivate any existing learning goals
    await supabase
      .from('learning_goals')
      .update({ is_active: false })
      .eq('user_id', userId)

    // Create the new learning goal
    const { data: goal, error: goalError } = await supabase
      .from('learning_goals')
      .insert({
        user_id: userId,
        weekly_hours: goalData.weekly_hours,
        block_duration: goalData.block_duration,
        wake_up_time: goalData.wake_up_time,
        sleep_time: goalData.sleep_time,
        break_duration: goalData.break_duration,
        is_active: goalData.is_active
      })
      .select()
      .single()

    if (goalError) {
      throw new Error(`Failed to create learning goal: ${goalError.message}`)
    }

    // Create subject distributions
    const subjectDistributions = goalData.subject_distribution.map(dist => ({
      learning_goal_id: goal.id,
      subject: dist.subject,
      percentage: dist.percentage
    }))

    const { error: distError } = await supabase
      .from('subject_distributions')
      .insert(subjectDistributions)

    if (distError) {
      throw new Error(`Failed to create subject distributions: ${distError.message}`)
    }

    return {
      ...goal,
      subject_distribution: goalData.subject_distribution
    }
  }

  static async updateLearningGoal(
    goalId: string,
    goalData: Partial<Omit<LearningGoal, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
  ): Promise<LearningGoal> {
    // Update the learning goal
    const { data: goal, error: goalError } = await supabase
      .from('learning_goals')
      .update({
        weekly_hours: goalData.weekly_hours,
        block_duration: goalData.block_duration,
        wake_up_time: goalData.wake_up_time,
        sleep_time: goalData.sleep_time,
        break_duration: goalData.break_duration,
        is_active: goalData.is_active
      })
      .eq('id', goalId)
      .select()
      .single()

    if (goalError) {
      throw new Error(`Failed to update learning goal: ${goalError.message}`)
    }

    // Update subject distributions if provided
    if (goalData.subject_distribution) {
      // Delete existing distributions
      await supabase
        .from('subject_distributions')
        .delete()
        .eq('learning_goal_id', goalId)

      // Insert new distributions
      const subjectDistributions = goalData.subject_distribution.map(dist => ({
        learning_goal_id: goalId,
        subject: dist.subject,
        percentage: dist.percentage
      }))

      const { error: distError } = await supabase
        .from('subject_distributions')
        .insert(subjectDistributions)

      if (distError) {
        throw new Error(`Failed to update subject distributions: ${distError.message}`)
      }
    }

    return {
      ...goal,
      subject_distribution: goalData.subject_distribution || []
    }
  }

  static async deleteLearningGoal(goalId: string): Promise<void> {
    const { error } = await supabase
      .from('learning_goals')
      .delete()
      .eq('id', goalId)

    if (error) {
      throw new Error(`Failed to delete learning goal: ${error.message}`)
    }
  }

  static async toggleLearningGoalStatus(goalId: string, isActive: boolean): Promise<LearningGoal> {
    return this.updateLearningGoal(goalId, { is_active: isActive })
  }

  static async getAllLearningGoals(userId: string): Promise<LearningGoal[]> {
    const { data, error } = await supabase
      .from('learning_goals')
      .select(`
        *,
        subject_distributions (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch learning goals: ${error.message}`)
    }

    return data.map((goal: any) => ({
      id: goal.id,
      user_id: goal.user_id,
      weekly_hours: goal.weekly_hours,
      block_duration: goal.block_duration,
      wake_up_time: goal.wake_up_time,
      sleep_time: goal.sleep_time,
      break_duration: goal.break_duration,
      is_active: goal.is_active,
      created_at: goal.created_at,
      updated_at: goal.updated_at,
      subject_distribution: goal.subject_distributions.map((dist: any) => ({
        subject: dist.subject,
        percentage: dist.percentage
      }))
    }))
  }
}

