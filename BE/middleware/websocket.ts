import { WebSocket } from "ws"
import llm from "@/utils/llm"
import { logger } from "@/middleware/logger"

export const websocketMiddleware = async (ws: WebSocket) => {
  logger.info("client connected")
  let clientAlive = true

  // PING/PONG双向检测
  const heartbeatInterval = setInterval(() => {
    if (!clientAlive) {
      return ws.close()
    }

    clientAlive = false
    ws.send(JSON.stringify({
      type: "PING",
    }))
  }, 30000)

  ws.on("message", async (raw: Buffer) => {
    const message = raw.toString()
    // logger.info(`received: ${message}`)
    const data = JSON.parse(message)
    if (data.type === "PONG") {
      clientAlive = true
    } else if (data.type === "PING") {
      ws.send(JSON.stringify({
        type: "PONG",
      }))
    } else if (data.type === "TEXT") {
      ws.send(JSON.stringify({ type: "TEXT_START" }))
      await llm(data.content, (chunk) => {
        ws.send(JSON.stringify({ type: "TEXT_CHUNK", content: chunk }))
      })
      ws.send(JSON.stringify({ type: "TEXT_END" }))
    }
  })

  ws.on("close", () => {
    logger.info("client closed")
    clearInterval(heartbeatInterval)
  })
}