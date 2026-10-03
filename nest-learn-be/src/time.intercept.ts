import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor, Optional, RequestTimeoutException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, tap, throwError, timeout, TimeoutError, map, catchError } from "rxjs";
import { AppService } from "./app.service.js";


@Injectable()
export class TimeInterceptor implements NestInterceptor {
  constructor(private readonly appService: AppService) {}
  // @Inject(AppService)
  // private readonly appService: AppService;

  private readonly logger = new Logger(TimeInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | Promise<Observable<any>> {
    const start = Date.now();
    // const classRoles = this.reflector.get("role", context.getClass())
    // const methodRoles = this.reflector.get("role", context.getHandler())
    // console.log(classRoles, methodRoles, this.appService.getHello());

    return next.handle().pipe(
      timeout(5000),
      tap(() => this.logger.log(Date.now() - start + "ms")),
      map((data) => ({ ...data, time: Date.now() - start })),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException("Request timeout"));
        }

        return throwError(() => err);
      })
    )
  }
}