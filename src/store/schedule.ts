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
  category?: string // カテゴリ（強化項目）
  created_at: string
  updated_at: string
}

// 固定予定の例外削除用
export type FixedEventExceptions = { [key: string]: string[] | undefined }

/**
 * UTC日付ズレを補正する関数
 * 既に保存されているUTC日付をローカル日付に変換する
 */
function fixUTCShift(blocks: StudyBlock[]): StudyBlock[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return (blocks || []).map((b) => {
    if (!b.date) return b
    
    // "YYYY-MM-DD" 形式の日付のみ対象
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date)) return b
    
    const [y, m, d] = b.date.split("-").map(Number)
    const local = new Date(y, (m || 1) - 1, d || 1)
    local.setHours(0, 0, 0, 0)
    
    // UTCで文字列にすると1日前扱いになるかチェック
    const utcStr = local.toISOString().split("T")[0]
    
    // 差を計算（ミリ秒→日）
    const utcDate = new Date(utcStr + "T00:00:00")
    const diffMs = local.getTime() - utcDate.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)
    
    // 1日より大きくズレていたら触らない（無限進むのを防ぐ）
    if (diffDays < 1 || diffDays > 1) {
      return b
    }
    
    // ここまで来たら「UTCにすると1日前になる」パターンなので +1日する
    const fixed = new Date(local.getTime())
    fixed.setDate(fixed.getDate() + 1)
    
    const yyyy = fixed.getFullYear()
    const mm = String(fixed.getMonth() + 1).padStart(2, "0")
    const dd = String(fixed.getDate()).padStart(2, "0")
    
    const fixedDate = `${yyyy}-${mm}-${dd}`
    
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')) {
      console.log(`[fixUTCShift] Fixed date from ${b.date} to ${fixedDate}`)
    }
    
    return { ...b, date: fixedDate }
  })
}

/**
 * 未来に飛びすぎた日付を修正する関数
 * 3日以上未来のデータを今日に戻す（一時的）
 */
function clampFuture(blocks: StudyBlock[]): StudyBlock[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return (blocks || []).map((b) => {
    if (!b.date) return b
    
    const [y, m, d] = b.date.split("-").map(Number)
    const dt = new Date(y, (m || 1) - 1, d || 1)
    dt.setHours(0, 0, 0, 0)
    
    const diffDays = (dt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    
    // 3日以上未来なら今日に戻す（暫定）
    if (diffDays >= 3) {
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, "0")
      const dd = String(today.getDate()).padStart(2, "0")
      
      const clampedDate = `${yyyy}-${mm}-${dd}`
      
      if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')) {
        console.log(`[clampFuture] Clamped date from ${b.date} to ${clampedDate}`)
      }
      
      return { ...b, date: clampedDate }
    }
    
    return b
  })
}

type ScheduleState = {
  // データ
  fixedEvents: FixedEvent[]
  studyBlocks: StudyBlock[]
  learningGoal: LearningGoal | null
  countdownTargets: CountdownTarget[]
  fixedEventExceptions: FixedEventExceptions
  
  // ハイドレーション完了フラグ
  hasHydrated: boolean
  
  // マイグレーションフラグ
  migratedUtcFix?: boolean // UTC日付ズレ補正を行ったか
  
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
      migratedUtcFix: false,
      
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
        
        if (!state) return
        
        // UTC日付ズレを補正（1回限り）
        if (!state.migratedUtcFix) {
          state.studyBlocks = fixUTCShift(state.studyBlocks || [])
          state.studyBlocks = clampFuture(state.studyBlocks || [])
          state.migratedUtcFix = true
          
          if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')) {
            console.log("✅ UTC日付ズレ補正を実行しました")
          }
        }
        
        if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')) {
          console.log("✅ Zustandストアのデータ読み込み完了")
          console.log("📊 読み込んだデータ:", {
          fixedEvents: state?.fixedEvents?.length || 0,
          studyBlocks: state?.studyBlocks?.length || 0,
          learningGoal: state?.learningGoal ? 'あり' : 'なし',
          countdownTargets: state?.countdownTargets?.length || 0,
          exceptions: Object.keys(state?.fixedEventExceptions || {}).length
          })
        }
        
        // ハイドレーション完了フラグを設定
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
  )
)

// ハイドレーション完了判定
export const useHydrated = () => {
  const hasHydrated = useScheduleStore((s) => s.hasHydrated)
  
  React.useEffect(() => {
    if (typeof window !== 'undefined' && !hasHydrated) {
      if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')) {
        console.log('🔄 明示的に persist.rehydrate() を呼び出します')
      }
      const rehydrate = async () => {
        try {
          const startTime = Date.now()
          await (useScheduleStore.persist as any).rehydrate()
          if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('debug')) {
            console.log(`✅ persist.rehydrate() 完了 (${Date.now() - startTime}ms)`)
          }
        } catch (error) {
          console.error('❌ Rehydration error:', error)
          // エラーが起きてもハイドレーション完了とする
          useScheduleStore.getState().setHasHydrated(true)
        }
      }
      rehydrate()
    }
  }, [hasHydrated])
  
  return hasHydrated
}
