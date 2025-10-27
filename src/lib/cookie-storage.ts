import Cookies from 'js-cookie'

const STORAGE_KEYS = {
  FIXED_EVENTS: 'schedule_fixed_events',
  STUDY_BLOCKS: 'schedule_study_blocks',
  LEARNING_GOAL: 'schedule_learning_goal',
  COUNTDOWN_TARGETS: 'schedule_countdown_targets',
  FIXED_EVENT_EXCEPTIONS: 'schedule_fixed_event_exceptions'
}

export const CookieStorage = {
  // 固定予定を保存
  saveFixedEvents(events: any[]) {
    try {
      Cookies.set(STORAGE_KEYS.FIXED_EVENTS, JSON.stringify(events), { expires: 365, sameSite: 'strict' })
      console.log('Cookie saved - FixedEvents:', events.length)
    } catch (error) {
      console.error('Failed to save fixed events:', error)
    }
  },

  // 固定予定を取得
  getFixedEvents(): any[] {
    try {
      const data = Cookies.get(STORAGE_KEYS.FIXED_EVENTS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('Cookie loaded - FixedEvents:', parsed.length)
        return parsed
      }
      console.log('Cookie not found - FixedEvents')
      return []
    } catch (error) {
      console.error('Failed to load fixed events:', error)
      return []
    }
  },

  // 学習ブロックを保存
  saveStudyBlocks(blocks: any[]) {
    try {
      Cookies.set(STORAGE_KEYS.STUDY_BLOCKS, JSON.stringify(blocks), { expires: 365, sameSite: 'strict' })
      console.log('Cookie saved - StudyBlocks:', blocks.length)
    } catch (error) {
      console.error('Failed to save study blocks:', error)
    }
  },

  // 学習ブロックを取得
  getStudyBlocks(): any[] {
    try {
      const data = Cookies.get(STORAGE_KEYS.STUDY_BLOCKS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('Cookie loaded - StudyBlocks:', parsed.length)
        return parsed
      }
      console.log('Cookie not found - StudyBlocks')
      return []
    } catch (error) {
      console.error('Failed to load study blocks:', error)
      return []
    }
  },

  // 学習目標を保存
  saveLearningGoal(goal: any) {
    try {
      if (goal) {
        Cookies.set(STORAGE_KEYS.LEARNING_GOAL, JSON.stringify(goal), { expires: 365, sameSite: 'strict' })
        console.log('Cookie saved - LearningGoal:', goal.id || 'new')
      } else {
        Cookies.remove(STORAGE_KEYS.LEARNING_GOAL)
        console.log('Cookie removed - LearningGoal')
      }
    } catch (error) {
      console.error('Failed to save learning goal:', error)
    }
  },

  // 学習目標を取得
  getLearningGoal(): any | null {
    const data = Cookies.get(STORAGE_KEYS.LEARNING_GOAL)
    return data ? JSON.parse(data) : null
  },

  // カウントダウン目標を保存
  saveCountdownTargets(targets: any[]) {
    Cookies.set(STORAGE_KEYS.COUNTDOWN_TARGETS, JSON.stringify(targets), { expires: 365 })
  },

  // カウントダウン目標を取得
  getCountdownTargets(): any[] {
    const data = Cookies.get(STORAGE_KEYS.COUNTDOWN_TARGETS)
    return data ? JSON.parse(data) : []
  },

  // 固定予定の例外を保存
  saveFixedEventExceptions(exceptions: { [key: string]: string[] | undefined }) {
    Cookies.set(STORAGE_KEYS.FIXED_EVENT_EXCEPTIONS, JSON.stringify(exceptions), { expires: 365 })
  },

  // 固定予定の例外を取得
  getFixedEventExceptions(): { [key: string]: string[] | undefined } {
    const data = Cookies.get(STORAGE_KEYS.FIXED_EVENT_EXCEPTIONS)
    return data ? JSON.parse(data) : {}
  },

  // すべてのデータをクリア
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      Cookies.remove(key)
    })
  }
}

const STORAGE_KEYS = {
  FIXED_EVENTS: 'schedule_fixed_events',
  STUDY_BLOCKS: 'schedule_study_blocks',
  LEARNING_GOAL: 'schedule_learning_goal',
  COUNTDOWN_TARGETS: 'schedule_countdown_targets',
  FIXED_EVENT_EXCEPTIONS: 'schedule_fixed_event_exceptions'
}

export const CookieStorage = {
  // 固定予定を保存
  saveFixedEvents(events: any[]) {
    try {
      Cookies.set(STORAGE_KEYS.FIXED_EVENTS, JSON.stringify(events), { expires: 365, sameSite: 'strict' })
      console.log('Cookie saved - FixedEvents:', events.length)
    } catch (error) {
      console.error('Failed to save fixed events:', error)
    }
  },

  // 固定予定を取得
  getFixedEvents(): any[] {
    try {
      const data = Cookies.get(STORAGE_KEYS.FIXED_EVENTS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('Cookie loaded - FixedEvents:', parsed.length)
        return parsed
      }
      console.log('Cookie not found - FixedEvents')
      return []
    } catch (error) {
      console.error('Failed to load fixed events:', error)
      return []
    }
  },

  // 学習ブロックを保存
  saveStudyBlocks(blocks: any[]) {
    try {
      Cookies.set(STORAGE_KEYS.STUDY_BLOCKS, JSON.stringify(blocks), { expires: 365, sameSite: 'strict' })
      console.log('Cookie saved - StudyBlocks:', blocks.length)
    } catch (error) {
      console.error('Failed to save study blocks:', error)
    }
  },

  // 学習ブロックを取得
  getStudyBlocks(): any[] {
    try {
      const data = Cookies.get(STORAGE_KEYS.STUDY_BLOCKS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('Cookie loaded - StudyBlocks:', parsed.length)
        return parsed
      }
      console.log('Cookie not found - StudyBlocks')
      return []
    } catch (error) {
      console.error('Failed to load study blocks:', error)
      return []
    }
  },

  // 学習目標を保存
  saveLearningGoal(goal: any) {
    try {
      if (goal) {
        Cookies.set(STORAGE_KEYS.LEARNING_GOAL, JSON.stringify(goal), { expires: 365, sameSite: 'strict' })
        console.log('Cookie saved - LearningGoal:', goal.id || 'new')
      } else {
        Cookies.remove(STORAGE_KEYS.LEARNING_GOAL)
        console.log('Cookie removed - LearningGoal')
      }
    } catch (error) {
      console.error('Failed to save learning goal:', error)
    }
  },

  // 学習目標を取得
  getLearningGoal(): any | null {
    const data = Cookies.get(STORAGE_KEYS.LEARNING_GOAL)
    return data ? JSON.parse(data) : null
  },

  // カウントダウン目標を保存
  saveCountdownTargets(targets: any[]) {
    Cookies.set(STORAGE_KEYS.COUNTDOWN_TARGETS, JSON.stringify(targets), { expires: 365 })
  },

  // カウントダウン目標を取得
  getCountdownTargets(): any[] {
    const data = Cookies.get(STORAGE_KEYS.COUNTDOWN_TARGETS)
    return data ? JSON.parse(data) : []
  },

  // 固定予定の例外を保存
  saveFixedEventExceptions(exceptions: { [key: string]: string[] | undefined }) {
    Cookies.set(STORAGE_KEYS.FIXED_EVENT_EXCEPTIONS, JSON.stringify(exceptions), { expires: 365 })
  },

  // 固定予定の例外を取得
  getFixedEventExceptions(): { [key: string]: string[] | undefined } {
    const data = Cookies.get(STORAGE_KEYS.FIXED_EVENT_EXCEPTIONS)
    return data ? JSON.parse(data) : {}
  },

  // すべてのデータをクリア
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      Cookies.remove(key)
    })
  }
}