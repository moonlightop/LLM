import { useSocketStore } from "@/store/socket"
import StableWebSocket from "@/utils/ws"

const useWs = (wsUrl: string) => {
  const socketStore = useSocketStore()

  const handleBusinessMessage = (data) => {
    if (!socketStore.isSending) {
      return
    }

    if (data.type === "CHUNK") {
      const session = {
        content: data.content,
        done: data.done,
      }
      socketStore.setActiveSessionAnswer(session)
    } else {
      socketStore.addSession(data)
    }
  }

  const ws = new StableWebSocket(wsUrl, handleBusinessMessage)

  return ws
}

export default useWs
