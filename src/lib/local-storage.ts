const STORAGE_KEYS = {
  FIXED_EVENTS: 'schedule_fixed_events',
  STUDY_BLOCKS: 'schedule_study_blocks',
  LEARNING_GOAL: 'schedule_learning_goal',
  COUNTDOWN_TARGETS: 'schedule_countdown_targets',
  FIXED_EVENT_EXCEPTIONS: 'schedule_fixed_event_exceptions'
}

export const LocalStorage = {
  // 固定予定を保存
  saveFixedEvents(events: any[]) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.FIXED_EVENTS, JSON.stringify(events))
      console.log('LocalStorage saved - FixedEvents:', events.length)
    } catch (error) {
      console.error('Failed to save fixed events:', error)
    }
  },

  // 固定予定を取得
  getFixedEvents(): any[] {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(STORAGE_KEYS.FIXED_EVENTS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - FixedEvents:', parsed.length)
        return parsed
      }
      console.log('LocalStorage not found - FixedEvents')
      return []
    } catch (error) {
      console.error('Failed to load fixed events:', error)
      return []
    }
  },

  // 学習ブロックを保存
  saveStudyBlocks(blocks: any[]) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.STUDY_BLOCKS, JSON.stringify(blocks))
      console.log('LocalStorage saved - StudyBlocks:', blocks.length)
    } catch (error) {
      console.error('Failed to save study blocks:', error)
    }
  },

  // 学習ブロックを取得
  getStudyBlocks(): any[] {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_BLOCKS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - StudyBlocks:', parsed.length)
        return parsed
      }
      console.log('LocalStorage not found - StudyBlocks')
      return []
    } catch (error) {
      console.error('Failed to load study blocks:', error)
      return []
    }
  },

  // 学習目標を保存
  saveLearningGoal(goal: any) {
    try {
      if (typeof window === 'undefined') return
      if (goal) {
        localStorage.setItem(STORAGE_KEYS.LEARNING_GOAL, JSON.stringify(goal))
        console.log('LocalStorage saved - LearningGoal:', goal.id || 'new')
      } else {
        localStorage.removeItem(STORAGE_KEYS.LEARNING_GOAL)
        console.log('LocalStorage removed - LearningGoal')
      }
    } catch (error) {
      console.error('Failed to save learning goal:', error)
    }
  },

  // 学習目標を取得
  getLearningGoal(): any | null {
    try {
      if (typeof window === 'undefined') return null
      const data = localStorage.getItem(STORAGE_KEYS.LEARNING_GOAL)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - LearningGoal')
        return parsed
      }
      console.log('LocalStorage not found - LearningGoal')
      return null
    } catch (error) {
      console.error('Failed to load learning goal:', error)
      return null
    }
  },

  // カウントダウン目標を保存
  saveCountdownTargets(targets: any[]) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.COUNTDOWN_TARGETS, JSON.stringify(targets))
      console.log('LocalStorage saved - CountdownTargets:', targets.length)
    } catch (error) {
      console.error('Failed to save countdown targets:', error)
    }
  },

  // カウントダウン目標を取得
  getCountdownTargets(): any[] {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(STORAGE_KEYS.COUNTDOWN_TARGETS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - CountdownTargets:', parsed.length)
        return parsed
      }
      console.log('LocalStorage not found - CountdownTargets')
      return []
    } catch (error) {
      console.error('Failed to load countdown targets:', error)
      return []
    }
  },

  // 固定予定の例外を保存
  saveFixedEventExceptions(exceptions: { [key: string]: string[] | undefined }) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.FIXED_EVENT_EXCEPTIONS, JSON.stringify(exceptions))
      console.log('LocalStorage saved - FixedEventExceptions:', Object.keys(exceptions).length)
    } catch (error) {
      console.error('Failed to save fixed event exceptions:', error)
    }
  },

  // 固定予定の例外を取得
  getFixedEventExceptions(): { [key: string]: string[] | undefined } {
    try {
      if (typeof window === 'undefined') return {}
      const data = localStorage.getItem(STORAGE_KEYS.FIXED_EVENT_EXCEPTIONS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - FixedEventExceptions:', Object.keys(parsed).length)
        return parsed
      }
      console.log('LocalStorage not found - FixedEventExceptions')
      return {}
    } catch (error) {
      console.error('Failed to load fixed event exceptions:', error)
      return {}
    }
  },

  // すべてのデータをクリア
  clearAll() {
    try {
      if (typeof window === 'undefined') return
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      console.log('LocalStorage cleared - All data')
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}

  STUDY_BLOCKS: 'schedule_study_blocks',
  LEARNING_GOAL: 'schedule_learning_goal',
  COUNTDOWN_TARGETS: 'schedule_countdown_targets',
  FIXED_EVENT_EXCEPTIONS: 'schedule_fixed_event_exceptions'
}

export const LocalStorage = {
  // 固定予定を保存
  saveFixedEvents(events: any[]) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.FIXED_EVENTS, JSON.stringify(events))
      console.log('LocalStorage saved - FixedEvents:', events.length)
    } catch (error) {
      console.error('Failed to save fixed events:', error)
    }
  },

  // 固定予定を取得
  getFixedEvents(): any[] {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(STORAGE_KEYS.FIXED_EVENTS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - FixedEvents:', parsed.length)
        return parsed
      }
      console.log('LocalStorage not found - FixedEvents')
      return []
    } catch (error) {
      console.error('Failed to load fixed events:', error)
      return []
    }
  },

  // 学習ブロックを保存
  saveStudyBlocks(blocks: any[]) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.STUDY_BLOCKS, JSON.stringify(blocks))
      console.log('LocalStorage saved - StudyBlocks:', blocks.length)
    } catch (error) {
      console.error('Failed to save study blocks:', error)
    }
  },

  // 学習ブロックを取得
  getStudyBlocks(): any[] {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_BLOCKS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - StudyBlocks:', parsed.length)
        return parsed
      }
      console.log('LocalStorage not found - StudyBlocks')
      return []
    } catch (error) {
      console.error('Failed to load study blocks:', error)
      return []
    }
  },

  // 学習目標を保存
  saveLearningGoal(goal: any) {
    try {
      if (typeof window === 'undefined') return
      if (goal) {
        localStorage.setItem(STORAGE_KEYS.LEARNING_GOAL, JSON.stringify(goal))
        console.log('LocalStorage saved - LearningGoal:', goal.id || 'new')
      } else {
        localStorage.removeItem(STORAGE_KEYS.LEARNING_GOAL)
        console.log('LocalStorage removed - LearningGoal')
      }
    } catch (error) {
      console.error('Failed to save learning goal:', error)
    }
  },

  // 学習目標を取得
  getLearningGoal(): any | null {
    try {
      if (typeof window === 'undefined') return null
      const data = localStorage.getItem(STORAGE_KEYS.LEARNING_GOAL)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - LearningGoal')
        return parsed
      }
      console.log('LocalStorage not found - LearningGoal')
      return null
    } catch (error) {
      console.error('Failed to load learning goal:', error)
      return null
    }
  },

  // カウントダウン目標を保存
  saveCountdownTargets(targets: any[]) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.COUNTDOWN_TARGETS, JSON.stringify(targets))
      console.log('LocalStorage saved - CountdownTargets:', targets.length)
    } catch (error) {
      console.error('Failed to save countdown targets:', error)
    }
  },

  // カウントダウン目標を取得
  getCountdownTargets(): any[] {
    try {
      if (typeof window === 'undefined') return []
      const data = localStorage.getItem(STORAGE_KEYS.COUNTDOWN_TARGETS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - CountdownTargets:', parsed.length)
        return parsed
      }
      console.log('LocalStorage not found - CountdownTargets')
      return []
    } catch (error) {
      console.error('Failed to load countdown targets:', error)
      return []
    }
  },

  // 固定予定の例外を保存
  saveFixedEventExceptions(exceptions: { [key: string]: string[] | undefined }) {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem(STORAGE_KEYS.FIXED_EVENT_EXCEPTIONS, JSON.stringify(exceptions))
      console.log('LocalStorage saved - FixedEventExceptions:', Object.keys(exceptions).length)
    } catch (error) {
      console.error('Failed to save fixed event exceptions:', error)
    }
  },

  // 固定予定の例外を取得
  getFixedEventExceptions(): { [key: string]: string[] | undefined } {
    try {
      if (typeof window === 'undefined') return {}
      const data = localStorage.getItem(STORAGE_KEYS.FIXED_EVENT_EXCEPTIONS)
      if (data) {
        const parsed = JSON.parse(data)
        console.log('LocalStorage loaded - FixedEventExceptions:', Object.keys(parsed).length)
        return parsed
      }
      console.log('LocalStorage not found - FixedEventExceptions')
      return {}
    } catch (error) {
      console.error('Failed to load fixed event exceptions:', error)
      return {}
    }
  },

  // すべてのデータをクリア
  clearAll() {
    try {
      if (typeof window === 'undefined') return
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      console.log('LocalStorage cleared - All data')
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  }
}
