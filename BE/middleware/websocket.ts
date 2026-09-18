import { WebSocket } from "ws"
import crypto from "crypto"

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
      ws.send(JSON.stringify({ type: "CHUNK", done: false, content: "" }))
      await llm(data.content, (chunk) => {
        ws.send(JSON.stringify({ type: "CHUNK", done: false, content: chunk }))
      })
      ws.send(JSON.stringify({ type: "CHUNK", done: true, content: "" }))
    }
  })

  ws.on("error", (err) => {
    logger.error(`WebSocket error: ${err.message}`)
    // 不关闭连接，仅记录错误，保持连接存活
    clientAlive = true
  })

  ws.on("close", () => {
    logger.info("client closed")
    clearInterval(heartbeatInterval)
  })
}