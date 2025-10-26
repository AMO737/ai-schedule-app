"use client"
import React from "react"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { FixedEvent, StudyBlock, LearningGoal } from "@/types"
import { idbStorage } from "@/lib/idbStorage"

// カウントダウンターゲット用の型
export interface CountdownTarget {
  id: string
  target_date: string // YYYY-MM-DD format
  target_hours: number
  completed_hours: number
  title: string
  created_at: string
  updated_at: string
}

// 固定予定の例外削除用
export type FixedEventExceptions = { [key: string]: string[] | undefined }

type ScheduleState = {
  // データ
  fixedEvents: FixedEvent[]
  studyBlocks: StudyBlock[]
  learningGoal: LearningGoal | null
  countdownTargets: CountdownTarget[]
  fixedEventExceptions: FixedEventExceptions
  
  // ハイドレーション完了フラグ
  hasHydrated: boolean
  
  // アクション - 固定予定
  addFixedEvent: (event: FixedEvent) => void
  updateFixedEvent: (id: string, event: Partial<FixedEvent>) => void
  removeFixedEvent: (id: string) => void
  setFixedEvents: (events: FixedEvent[] | ((prev: FixedEvent[]) => FixedEvent[])) => void
  
  // アクション - 学習ブロック
  addStudyBlock: (block: StudyBlock) => void
  updateStudyBlock: (id: string, block: Partial<StudyBlock>) => void
  removeStudyBlock: (id: string) => void
  setStudyBlocks: (blocks: StudyBlock[] | ((prev: StudyBlock[]) => StudyBlock[])) => void
  
  // アクション - 学習目標
  setLearningGoal: (goal: LearningGoal | null) => void
  
  // アクション - カウントダウン
  addCountdownTarget: (target: CountdownTarget) => void
  updateCountdownTarget: (id: string, target: Partial<CountdownTarget>) => void
  removeCountdownTarget: (id: string) => void
  setCountdownTargets: (targets: CountdownTarget[] | ((prev: CountdownTarget[]) => CountdownTarget[])) => void
  
  // アクション - 固定予定例外
  addFixedEventException: (eventId: string, date: string) => void
  removeFixedEventException: (eventId: string, date: string) => void
  setFixedEventExceptions: (exceptions: FixedEventExceptions | ((prev: FixedEventExceptions) => FixedEventExceptions)) => void
  
  // クリア
  clearAll: () => void
  
  // ハイドレーション
  setHasHydrated: (value: boolean) => void
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set) => ({
      // 初期状態
      fixedEvents: [],
      studyBlocks: [],
      learningGoal: null,
      countdownTargets: [],
      fixedEventExceptions: {},
      hasHydrated: false,
      
      // ハイドレーション
      setHasHydrated: (value) => set({ hasHydrated: value }),
      
      // 固定予定
      addFixedEvent: (event) => set((s) => ({ fixedEvents: [...s.fixedEvents, event] })),
      updateFixedEvent: (id, updates) => set((s) => ({
        fixedEvents: s.fixedEvents.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      removeFixedEvent: (id) => set((s) => ({
        fixedEvents: s.fixedEvents.filter(e => e.id !== id)
      })),
      setFixedEvents: (events) => {
        if (typeof events === 'function') {
          set((s) => ({ fixedEvents: events(s.fixedEvents) }))
        } else {
          set({ fixedEvents: events })
        }
      },
      
      // 学習ブロック
      addStudyBlock: (block) => set((s) => ({ studyBlocks: [...s.studyBlocks, block] })),
      updateStudyBlock: (id, updates) => set((s) => ({
        studyBlocks: s.studyBlocks.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      removeStudyBlock: (id) => set((s) => ({
        studyBlocks: s.studyBlocks.filter(b => b.id !== id)
      })),
      setStudyBlocks: (blocks) => {
        if (typeof blocks === 'function') {
          set((s) => ({ studyBlocks: blocks(s.studyBlocks) }))
        } else {
          set({ studyBlocks: blocks })
        }
      },
      
      // 学習目標
      setLearningGoal: (goal) => set({ learningGoal: goal }),
      
      // カウントダウン
      addCountdownTarget: (target) => set((s) => ({ countdownTargets: [...s.countdownTargets, target] })),
      updateCountdownTarget: (id, updates) => set((s) => ({
        countdownTargets: s.countdownTargets.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      removeCountdownTarget: (id) => set((s) => ({
        countdownTargets: s.countdownTargets.filter(t => t.id !== id)
      })),
      setCountdownTargets: (targets) => {
        if (typeof targets === 'function') {
          set((s) => ({ countdownTargets: targets(s.countdownTargets) }))
        } else {
          set({ countdownTargets: targets })
        }
      },
      
      // 固定予定例外
      addFixedEventException: (eventId, date) => set((s) => ({
        fixedEventExceptions: {
          ...s.fixedEventExceptions,
          [date]: [...(s.fixedEventExceptions[date] || []), eventId]
        }
      })),
      removeFixedEventException: (eventId, date) => set((s) => {
        const exceptions = s.fixedEventExceptions[date]?.filter(id => id !== eventId) || []
        return {
          fixedEventExceptions: {
            ...s.fixedEventExceptions,
            [date]: exceptions.length > 0 ? exceptions : undefined
          }
        }
      }),
      setFixedEventExceptions: (exceptions) => {
        if (typeof exceptions === 'function') {
          set((s) => ({ fixedEventExceptions: exceptions(s.fixedEventExceptions) }))
        } else {
          set({ fixedEventExceptions: exceptions })
        }
      },
      
      // 全クリア
      clearAll: () => set({
        fixedEvents: [],
        studyBlocks: [],
        learningGoal: null,
        countdownTargets: [],
        fixedEventExceptions: {}
      })
    }),
    {
      name: "ai-schedule-app:v1",
      storage: typeof window !== "undefined" ? createJSONStorage(() => {
        // ブラウザでストレージの永続化を要求
        if ('navigator' in window && 'storage' in navigator && 'persist' in navigator.storage) {
          navigator.storage.persist().catch(() => {
            console.log('ストレージの永続化リクエストは無視されました')
          })
        }
        
        // IndexedDB を使用
        return idbStorage
      }) : undefined,
      version: 1,
      skipHydration: true,
      // 初期データ読み込み完了フラグ
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Rehydration error:', error)
          return
        }
        
        console.log("✅ Zustandストアのデータ読み込み完了")
        console.log("📊 読み込んだデータ:", {
          fixedEvents: state?.fixedEvents?.length || 0,
          studyBlocks: state?.studyBlocks?.length || 0,
          learningGoal: state?.learningGoal ? 'あり' : 'なし',
          countdownTargets: state?.countdownTargets?.length || 0,
          exceptions: Object.keys(state?.fixedEventExceptions || {}).length
        })
        
        // ハイドレーション完了フラグを設定
        if (state) {
          state.setHasHydrated(true)
          
          // Cookieにも保存（IndexedDBのバックアップ）
          if (typeof window !== 'undefined') {
            fetch('/api/state', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data: state })
            }).catch(err => console.error('Cookie保存エラー:', err))
          }
        }
      }
    }
  )
)

// ハイドレーション完了判定
export const useHydrated = () => {
  const hasHydrated = useScheduleStore((s) => s.hasHydrated)
  
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !hasHydrated) {
      const rehydrate = async () => {
        try {
          await (useScheduleStore.persist as any).rehydrate()
        } catch (error) {
          console.error('Rehydration error:', error)
          // エラーが起きてもハイドレーション完了とする
          useScheduleStore.getState().setHasHydrated(true)
        }
      }
      rehydrate()
    }
  }, [hasHydrated])
  
  return hasHydrated
}
