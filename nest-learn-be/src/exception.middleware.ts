import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";


@Injectable()
export class ExceptionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    console.log("before2", req.originalUrl);
    next();
    console.log("after2", req.originalUrl);
  }
}