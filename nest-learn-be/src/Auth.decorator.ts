import { applyDecorators, Controller } from "@nestjs/common"
import { Roles } from "./roles.decorator.js"


export const Auth = (...roles: string[]) => {
  return applyDecorators(
    Controller({ host: ":host.0.0.1", path: "/" }),
    Roles(...roles)
  )
}