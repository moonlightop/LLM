import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log("before1", req.originalUrl);
    next();
    console.log("after1", req.originalUrl);
  }
}