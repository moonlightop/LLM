import { defineStore } from "pinia"

interface IRecord {
  id: string
  question: string
  answer: string
}

export const useSocketStore = defineStore("socket", {
  state: (): {
    histories: IRecord[]
    sessions: IRecord[]
  } => ({
    histories: [{
      id: "1",
      question: "你好",
      answer: "你好, 我是一个智能助手, 你可以问我任何问题, 我会尽力回答",
    }],
    sessions: [{
      id: "2",
      question: "你好",
      answer: "你好, 我是一个智能助手, 你可以问我任何问题, 我会尽力回答",
    }, {
      id: "3",
      question: "你好",
      answer: "你好, 我是一个智能助手, 你可以问我任何问题, 我会尽力回答",
    }, {
      id: "4",
      question: "你好",
      answer: "你好, 我是一个智能助手, 你可以问我任何问题, 我会尽力回答",
    }]
  }),
  actions: {
    setStreamSession(session: IRecord) {
      const lastSession = this.sessions[this.sessions.length - 1]
      if (session.done) {
        return
      }

      lastSession.answer += session.content
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
  },
  getters: {
    activeSession: (state) => state.sessions[state.sessions.length - 1]
  },
})