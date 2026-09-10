import os from "os"
import Koa from "koa"
import http from "http"
import koaBody from "koa-body"
import { WebSocketServer } from "ws"

import router from "@/routes"
import { getLocalIP, getHttpLocalPort, getWsLocalPort } from "@/utils/network"
import { logger, loggerMiddleware } from "@/middleware/logger"
import { responseMiddleware } from "@/middleware/response"
import { websocketMiddleware } from "@/middleware/websocket"

const ip = getLocalIP()
const httpPort = getHttpLocalPort()
const wsPort = getWsLocalPort()
const app = new Koa()

app.use(koaBody({ multipart: true }))
app.use(loggerMiddleware)
app.use(responseMiddleware)
app.use(router.routes())
  .use(router.allowedMethods())

// http server
const httpServer = http.createServer(app.callback())
httpServer.listen(httpPort)
httpServer.on("error", (err: Error) => {
  logger.error(err)
})
httpServer.on("listening", () => {
  logger.info(`app started at address http://${ip}:${httpPort}`)
})

// websocket server
const wss = new WebSocketServer({ port: wsPort })
wss.on("connection", websocketMiddleware)
wss.on("listening", () => {
  logger.info(`ws server started at address ws://${ip}:${wsPort}`)
})