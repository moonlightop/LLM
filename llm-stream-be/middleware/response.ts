import { CODE_SUCCESS, MSG_SUCCESS } from "@/config/constant"

export const responseMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  await next()
  if (ctx.body) {
    ctx.body = {
      code: CODE_SUCCESS,
      msg: MSG_SUCCESS,
      data: ctx.body,
    }
  }
}