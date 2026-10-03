import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

export const MyHeaders = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return data ? request.headers[data.toLocaleLowerCase()] : request.headers;
})