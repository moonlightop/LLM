import os from "os"
import { HTTP_PORT, WS_PORT } from "@/config/constant"

/** 获取本机局域网 IPv4 地址 */
export const getLocalIP = (): string => {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    const nets = interfaces[name]
    if (!nets) continue
    for (const net of nets) {
      // 跳过内部回环地址和 IPv6，取第一个非内部 IPv4 地址
      if (!net.internal && net.family === "IPv4") {
        return net.address
      }
    }
  }
  return "localhost"
}

/** 获取本机局域网端口号 */
export const getHttpLocalPort = (): number => {
  return HTTP_PORT
}
export const getWsLocalPort = (): number => {
  return WS_PORT
}
