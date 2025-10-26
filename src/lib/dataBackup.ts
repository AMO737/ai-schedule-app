import { FixedEvent, StudyBlock, LearningGoal } from "@/types"
import { CountdownTarget } from "@/store/schedule"

export interface BackupData {
  fixedEvents: FixedEvent[]
  studyBlocks: StudyBlock[]
  learningGoal: LearningGoal | null
  countdownTargets: CountdownTarget[]
  exportedAt: string
  version: string
}

export const exportToJSON = (
  fixedEvents: FixedEvent[],
  studyBlocks: StudyBlock[],
  learningGoal: LearningGoal | null,
  countdownTargets: CountdownTarget[]
): void => {
  const data: BackupData = {
    fixedEvents,
    studyBlocks,
    learningGoal,
    countdownTargets,
    exportedAt: new Date().toISOString(),
    version: '1.0.0'
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `schedule-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const importFromJSON = async (file: File): Promise<BackupData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as BackupData
        resolve(data)
      } catch (error) {
        reject(new Error('無効なJSONファイルです'))
      }
    }
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'))
    reader.readAsText(file)
  })
}
