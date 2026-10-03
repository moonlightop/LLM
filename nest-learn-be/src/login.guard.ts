import { CanActivate, ExecutionContext, Inject } from "@nestjs/common";
import { Observable } from "rxjs";
import { AppService } from "./app.service.js";
import { Reflector } from "@nestjs/core";

export class LoginGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const classRoles = this.reflector.get("role", context.getClass())
    const methodRoles = this.reflector.get("role", context.getHandler())

    console.log(classRoles, methodRoles)
    return true;
  }
}