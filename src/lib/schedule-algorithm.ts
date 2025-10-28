import { FixedEvent, LearningGoal, StudyBlock, TimeSlot, SubjectDistribution } from '@/types'

export class ScheduleAlgorithm {
  generateStudyBlocks(
    fixedEvents: FixedEvent[],
    learningGoal: LearningGoal,
    targetDate: Date
  ): StudyBlock[] {
    const studyBlocks: StudyBlock[] = []
    const dateStr = targetDate.toISOString().split('T')[0]
    
    // 1. 固定予定を除外して空き時間スロットを生成
    const availableSlots = this.generateAvailableSlots(fixedEvents, learningGoal, targetDate)
    
    // 2. 学習目標を時間配分に変換
    const subjectRequirements = this.calculateSubjectRequirements(learningGoal)
    
    // 3. 貪欲法でスロットに自動割当
    const assignments = this.greedyAssignment(availableSlots, subjectRequirements, learningGoal.block_duration)
    
    // 4. StudyBlockオブジェクトを生成
    assignments.forEach((assignment, index) => {
      studyBlocks.push({
        id: `block_${dateStr}_${index}`,
        user_id: '', // 実際の実装では認証されたユーザーIDを使用
        subject: assignment.subject,
        date: dateStr,
        start_time: assignment.slot.start_time,
        end_time: assignment.slot.end_time,
        duration: assignment.slot.duration,
        color: '#10B981',
        is_completed: false,
        is_skipped: false,
        hasAlarm: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    })
    
    return studyBlocks
  }
  
  private generateAvailableSlots(
    fixedEvents: FixedEvent[],
    learningGoal: LearningGoal,
    targetDate: Date
  ): TimeSlot[] {
    const dayOfWeek = targetDate.getDay()
    const slots: TimeSlot[] = []
    
    // 起床時刻から就寝時刻までの時間を分割
    const wakeUpTime = this.parseTime(learningGoal.wake_up_time)
    const sleepTime = this.parseTime(learningGoal.sleep_time)
    
    // 固定予定をその日の予定として取得
    const dayFixedEvents = fixedEvents.filter(event => 
      event.day_of_week === dayOfWeek && event.is_active
    )
    
    // 時間帯を30分単位で分割して空き時間を検出
    let currentTime = new Date(targetDate)
    currentTime.setHours(wakeUpTime.hours, wakeUpTime.minutes, 0, 0)
    
    const endTime = new Date(targetDate)
    endTime.setHours(sleepTime.hours, sleepTime.minutes, 0, 0)
    
    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + 30 * 60000) // 30分後
      
      // この時間帯が固定予定と重複しないかチェック
      const isConflicted = dayFixedEvents.some(event => {
        const eventStart = this.parseTime(event.start_time)
        const eventEnd = this.parseTime(event.end_time)
        
        const slotStart = { hours: currentTime.getHours(), minutes: currentTime.getMinutes() }
        const slotEnd = { hours: slotEndTime.getHours(), minutes: slotEndTime.getMinutes() }
        
        return this.isTimeOverlapping(
          slotStart, slotEnd,
          eventStart, eventEnd
        )
      })
      
      slots.push({
        start_time: this.formatTime(currentTime),
        end_time: this.formatTime(slotEndTime),
        duration: 30,
        is_available: !isConflicted,
        conflict_reason: isConflicted ? 'Fixed event conflict' : undefined
      })
      
      currentTime = slotEndTime
    }
    
    return slots.filter(slot => slot.is_available)
  }
  
  private calculateSubjectRequirements(learningGoal: LearningGoal): Map<string, number> {
    const weeklyMinutes = learningGoal.weekly_hours * 60
    const requirements = new Map<string, number>()
    
    learningGoal.subject_distribution.forEach(dist => {
      const minutes = Math.floor(weeklyMinutes * dist.percentage / 100)
      requirements.set(dist.subject, minutes)
    })
    
    return requirements
  }
  
  private greedyAssignment(
    availableSlots: TimeSlot[],
    subjectRequirements: Map<string, number>,
    blockDuration: number
  ): Array<{ subject: string; slot: TimeSlot }> {
    const assignments: Array<{ subject: string; slot: TimeSlot }> = []
    const remainingRequirements = new Map(subjectRequirements)
    
    // スロットを長さ順でソート（長いスロットを優先）
    const sortedSlots = [...availableSlots].sort((a, b) => b.duration - a.duration)
    
    for (const slot of sortedSlots) {
      if (slot.duration >= blockDuration) {
        // 最も必要度の高い科目を選択
        const subject = this.selectSubjectWithHighestNeed(remainingRequirements)
        
        if (subject && remainingRequirements.get(subject)! > 0) {
          assignments.push({ subject, slot })
          
          // 必要時間を減らす
          const remaining = remainingRequirements.get(subject)! - blockDuration
          remainingRequirements.set(subject, Math.max(0, remaining))
        }
      }
    }
    
    return assignments
  }
  
  private selectSubjectWithHighestNeed(requirements: Map<string, number>): string | null {
    let maxSubject: string | null = null
    let maxNeed = 0
    
    for (const [subject, need] of requirements) {
      if (need > maxNeed) {
        maxNeed = need
        maxSubject = subject
      }
    }
    
    return maxSubject
  }
  
  private parseTime(timeStr: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return { hours, minutes }
  }
  
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
  
  private isTimeOverlapping(
    start1: { hours: number; minutes: number },
    end1: { hours: number; minutes: number },
    start2: { hours: number; minutes: number },
    end2: { hours: number; minutes: number }
  ): boolean {
    const time1Start = start1.hours * 60 + start1.minutes
    const time1End = end1.hours * 60 + end1.minutes
    const time2Start = start2.hours * 60 + start2.minutes
    const time2End = end2.hours * 60 + end2.minutes
    
    return time1Start < time2End && time2Start < time1End
  }
}


export class ScheduleAlgorithm {
  generateStudyBlocks(
    fixedEvents: FixedEvent[],
    learningGoal: LearningGoal,
    targetDate: Date
  ): StudyBlock[] {
    const studyBlocks: StudyBlock[] = []
    const dateStr = targetDate.toISOString().split('T')[0]
    
    // 1. 固定予定を除外して空き時間スロットを生成
    const availableSlots = this.generateAvailableSlots(fixedEvents, learningGoal, targetDate)
    
    // 2. 学習目標を時間配分に変換
    const subjectRequirements = this.calculateSubjectRequirements(learningGoal)
    
    // 3. 貪欲法でスロットに自動割当
    const assignments = this.greedyAssignment(availableSlots, subjectRequirements, learningGoal.block_duration)
    
    // 4. StudyBlockオブジェクトを生成
    assignments.forEach((assignment, index) => {
      studyBlocks.push({
        id: `block_${dateStr}_${index}`,
        user_id: '', // 実際の実装では認証されたユーザーIDを使用
        subject: assignment.subject,
        date: dateStr,
        start_time: assignment.slot.start_time,
        end_time: assignment.slot.end_time,
        duration: assignment.slot.duration,
        color: '#10B981',
        is_completed: false,
        is_skipped: false,
        hasAlarm: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    })
    
    return studyBlocks
  }
  
  private generateAvailableSlots(
    fixedEvents: FixedEvent[],
    learningGoal: LearningGoal,
    targetDate: Date
  ): TimeSlot[] {
    const dayOfWeek = targetDate.getDay()
    const slots: TimeSlot[] = []
    
    // 起床時刻から就寝時刻までの時間を分割
    const wakeUpTime = this.parseTime(learningGoal.wake_up_time)
    const sleepTime = this.parseTime(learningGoal.sleep_time)
    
    // 固定予定をその日の予定として取得
    const dayFixedEvents = fixedEvents.filter(event => 
      event.day_of_week === dayOfWeek && event.is_active
    )
    
    // 時間帯を30分単位で分割して空き時間を検出
    let currentTime = new Date(targetDate)
    currentTime.setHours(wakeUpTime.hours, wakeUpTime.minutes, 0, 0)
    
    const endTime = new Date(targetDate)
    endTime.setHours(sleepTime.hours, sleepTime.minutes, 0, 0)
    
    while (currentTime < endTime) {
      const slotEndTime = new Date(currentTime.getTime() + 30 * 60000) // 30分後
      
      // この時間帯が固定予定と重複しないかチェック
      const isConflicted = dayFixedEvents.some(event => {
        const eventStart = this.parseTime(event.start_time)
        const eventEnd = this.parseTime(event.end_time)
        
        const slotStart = { hours: currentTime.getHours(), minutes: currentTime.getMinutes() }
        const slotEnd = { hours: slotEndTime.getHours(), minutes: slotEndTime.getMinutes() }
        
        return this.isTimeOverlapping(
          slotStart, slotEnd,
          eventStart, eventEnd
        )
      })
      
      slots.push({
        start_time: this.formatTime(currentTime),
        end_time: this.formatTime(slotEndTime),
        duration: 30,
        is_available: !isConflicted,
        conflict_reason: isConflicted ? 'Fixed event conflict' : undefined
      })
      
      currentTime = slotEndTime
    }
    
    return slots.filter(slot => slot.is_available)
  }
  
  private calculateSubjectRequirements(learningGoal: LearningGoal): Map<string, number> {
    const weeklyMinutes = learningGoal.weekly_hours * 60
    const requirements = new Map<string, number>()
    
    learningGoal.subject_distribution.forEach(dist => {
      const minutes = Math.floor(weeklyMinutes * dist.percentage / 100)
      requirements.set(dist.subject, minutes)
    })
    
    return requirements
  }
  
  private greedyAssignment(
    availableSlots: TimeSlot[],
    subjectRequirements: Map<string, number>,
    blockDuration: number
  ): Array<{ subject: string; slot: TimeSlot }> {
    const assignments: Array<{ subject: string; slot: TimeSlot }> = []
    const remainingRequirements = new Map(subjectRequirements)
    
    // スロットを長さ順でソート（長いスロットを優先）
    const sortedSlots = [...availableSlots].sort((a, b) => b.duration - a.duration)
    
    for (const slot of sortedSlots) {
      if (slot.duration >= blockDuration) {
        // 最も必要度の高い科目を選択
        const subject = this.selectSubjectWithHighestNeed(remainingRequirements)
        
        if (subject && remainingRequirements.get(subject)! > 0) {
          assignments.push({ subject, slot })
          
          // 必要時間を減らす
          const remaining = remainingRequirements.get(subject)! - blockDuration
          remainingRequirements.set(subject, Math.max(0, remaining))
        }
      }
    }
    
    return assignments
  }
  
  private selectSubjectWithHighestNeed(requirements: Map<string, number>): string | null {
    let maxSubject: string | null = null
    let maxNeed = 0
    
    for (const [subject, need] of requirements) {
      if (need > maxNeed) {
        maxNeed = need
        maxSubject = subject
      }
    }
    
    return maxSubject
  }
  
  private parseTime(timeStr: string): { hours: number; minutes: number } {
    const [hours, minutes] = timeStr.split(':').map(Number)
    return { hours, minutes }
  }
  
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }
  
  private isTimeOverlapping(
    start1: { hours: number; minutes: number },
    end1: { hours: number; minutes: number },
    start2: { hours: number; minutes: number },
    end2: { hours: number; minutes: number }
  ): boolean {
    const time1Start = start1.hours * 60 + start1.minutes
    const time1End = end1.hours * 60 + end1.minutes
    const time2Start = start2.hours * 60 + start2.minutes
    const time2End = end2.hours * 60 + end2.minutes
    
    return time1Start < time2End && time2Start < time1End
  }
}

