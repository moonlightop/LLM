import StableWebSocket from "@/utils/ws"

const useWs = (wsUrl: string) => {
  const ws = new StableWebSocket(wsUrl)

  return ws
}

export default useWs
