import { defineStore } from "pinia"

interface IRecord {
  id: string
  question: string
  answer: string
}

const STORAGE_KEY = "chat_data"

export const useSocketStore = defineStore("socket", {
  state: (): {
    histories: IRecord[]
    sessions: IRecord[]
    isSending: boolean
    historyPage: number
    historyHasMore: boolean
    historyLoading: boolean
  } => ({
    histories: [],
    sessions: [],
    isSending: false,
    activeSession: {} as any,
    historyPage: 0,
    historyHasMore: true,
    historyLoading: false,
  }),
  actions: {
    setActiveSessionAnswer(session: IRecord) {
      if (session.done) {
        this.isSending = false
        return
      }

      this.activeSession.answer += session.content
    },
    addActiveSession(session: IRecord) {
      this.activeSession = session
    },
    addSession(session: IRecord) {
      this.sessions.push({
        id: session.id,
        question: session.question,
        answer: session.answer
      })
    },
    addHistories(histories: IRecord[]) {
      this.histories.push(...histories)
    },
    prependHistories(histories: IRecord[]) {
      this.histories.unshift(...histories)
    },
    loadMoreHistory() {
      if (this.historyLoading || !this.historyHasMore) {
        return
      }
      this.historyLoading = true

      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const allRecords: IRecord[] = raw ? JSON.parse(raw) : []
        const pageSize = 10
        const nextPage = this.historyPage + 1
        const end = allRecords.length - (nextPage - 1) * pageSize
        const start = allRecords.length - nextPage * pageSize
        const records = allRecords.slice(Math.max(0, start), end)

        if (records.length) {
          this.prependHistories(records)
        }
        this.historyPage = nextPage
        this.historyHasMore = start > 0
        this.historyLoading = false
      } catch (err) {
        console.log("loadMoreHistory", err)
      }
    },
    saveToLocalStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const prev: IRecord[] = raw ? JSON.parse(raw) : []
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...prev, ...this.sessions]))
      } catch (err) {
        console.log("saveToLocalStorage", err)
      }
    },
    loadFromLocalStorage() {
      this.historyPage = 0
      this.historyHasMore = true
      this.histories = []
      this.loadMoreHistory()
    },
    clearLocalStorage() {
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})