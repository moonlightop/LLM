import log4js from "log4js"
import Koa from "koa"

log4js.configure("./log4js.json")

export const logger = log4js.getLogger()

export const loggerMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const start = new Date()
  await next()
  const ms = Number(new Date()) - Number(start)

  const logText = [
    `[请求方法]${ctx.method}`,
    `[状态码]${ctx.status}`,
    `[请求路径]${ctx.url}`,
    `[请求参数]${JSON.stringify(ctx.request.body) ?? ''}`,
    `[响应参数]${JSON.stringify(ctx.body)}`,
  ].join('')

  logger.info(logText)
}