export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export interface FixedEvent {
  id: string
  user_id: string
  title: string
  day_of_week: number // 0: Sunday, 1: Monday, ..., 6: Saturday
  start_time: string // HH:MM format
  end_time: string // HH:MM format
  color: string // Color code (e.g., '#3B82F6')
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LearningGoal {
  id: string
  user_id: string
  weekly_hours: number
  subject_distribution: SubjectDistribution[]
  block_duration: number // minutes
  wake_up_time: string // HH:MM format
  sleep_time: string // HH:MM format
  break_duration: number // minutes
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubjectDistribution {
  subject: string
  percentage: number
}

export interface StudyBlock {
  id: string
  user_id: string
  subject: string
  date: string // YYYY-MM-DD format
  start_time: string // HH:MM format
  end_time: string // HH:MM format
  duration: number // minutes
  color: string // Color code (e.g., '#10B981')
  is_completed: boolean
  is_skipped: boolean
  hasAlarm: boolean // アラーム機能の有無
  completed_at?: string
  created_at: string
  updated_at: string
}

export interface WeeklyProgress {
  week_start_date: string
  total_planned_hours: number
  total_completed_hours: number
  completion_rate: number
  subject_progress: SubjectProgress[]
}

export interface SubjectProgress {
  subject: string
  planned_hours: number
  completed_hours: number
  completion_rate: number
}

export interface TimeSlot {
  start_time: string
  end_time: string
  duration: number
  is_available: boolean
  conflict_reason?: string
}

export interface ScheduleAlgorithm {
  generateStudyBlocks(
    fixedEvents: FixedEvent[],
    learningGoal: LearningGoal,
    targetDate: Date
  ): StudyBlock[]
}

export interface NotificationSettings {
  reminder_minutes_before: number
  snooze_minutes: number
  enable_push_notifications: boolean
  enable_email_notifications: boolean
}
