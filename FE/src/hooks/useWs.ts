import { useSocketStore } from "@/store/socket"
import StableWebSocket from "@/utils/ws"

const useWs = (wsUrl: string) => {
  const socketStore = useSocketStore()

  const handleBusinessMessage = (data) => {
    console.log("收到业务消息", data)
    if (data.type === "CHUNK") {
      const session = {
        id: data.id,
        content: data.content,
        done: data.done,
      }
      socketStore.setStreamSession(session)
    } else {
      socketStore.addSession(data)
    }
  }

  const ws = new StableWebSocket(wsUrl, handleBusinessMessage)

  return ws
}

export default useWs
