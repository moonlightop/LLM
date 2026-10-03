class StableWebSocket {
  constructor(url: string, handleBusinessMessage: (data) => void) {
    this.url = url
    this.ws = null
    this.handleBusinessMessage = handleBusinessMessage

    // 心跳检测配置
    this.heartbeatInterval = 3000
    this.serverTimeout = 10000
    this.heartbeatTimer = null
    this.pingTimeoutId = null

    // 重连配置
    this.reconnecting = false
    this.reconnectAttemps = 0
    this.maxReconnectAttemps = 10
    this.baseReconnectInterval = 1000
    this.maxReconnectInterval = 30000

    this.init()
  }
  init() {
    // 清理旧连接
    this.destroy()

    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log("WebSocket连接已建立, 开始心跳检测")
      // 重置重连计数
      this.reconnectAttemps = 0
      // 开始心跳检测
      this.startHeartbeat()
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("收到消息: ", data)

      if (data.type === "PONG") {
        // 收到服务器的心跳回复
        clearTimeout(this.pingTimeoutId)
      } else if (data.type === "PING") {
        // 服务器发来的心跳检测，回复 PONG
        this.ws.send(JSON.stringify({ type: "PONG" }))
      } else {
        this.handleBusinessMessage(data)
      }
    }

    this.ws.onclose = (event) => {
      console.log("WebSocket连接关闭, 停止心跳, code:", event.code)
      // 停止心跳检测
      this.stopHeartbeat()
      // 指数退避重连, 1000 表示正常关闭，其他值表示异常关闭
      if (event.code !== 1000) {
        this.reconnect()
      }
    }

    this.ws.onerror = (err) => {
      console.log("WebSocket连接错误", err)
    }
  }

  destroy() {
    // 停止心跳
    this.stopHeartbeat()
    // 清理旧 ws 事件和连接
    if (this.ws) {
      this.ws.onopen = null
      this.ws.onmessage = null
      this.ws.onclose = null
      this.ws.onerror = null
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close()
      }
      this.ws = null
    }
  }

  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "PING" }))
        console.log("发送心跳PING")

        this.pingTimeoutId = setTimeout(() => {
          console.log("心跳超时, 关闭连接")
          this.ws.close()
        }, this.serverTimeout)
      }
    }, this.heartbeatInterval)
  }

  stopHeartbeat() {
    clearInterval(this.heartbeatTimer)
    clearTimeout(this.pingTimeoutId)
    this.heartbeatTimer = null
    this.pingTimeoutId = null
  }

  reconnect() {
    if (this.reconnecting || this.reconnectAttemps >= this.maxReconnectAttemps) {
      console.log("已达到最大重连次数, 停止重连")
      return
    }

    this.reconnecting = true
    this.reconnectAttemps++

    const delay = Math.min(
      this.baseReconnectInterval * Math.pow(2, this.reconnectAttemps - 1),
      this.maxReconnectInterval,
    )

    console.log(`将在 ${delay/1000} 秒后进行第 ${this.reconnectAttemps} 次重连...`)

    setTimeout(() => {
      this.init()
      this.reconnecting = false
    }, delay)
  }

  close() {
    this.destroy()
  }

  handleBusinessMessage(data) {
    this.handleBusinessMessage(data)
  }

  sendText(text: string) {
    this.ws.send(JSON.stringify({ type: "TEXT", content: text }))
  }
}

export default StableWebSocket