import { NestApplication, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { LoginGuard } from "./login.guard.js";
import { TimeInterceptor } from "./time.intercept.js";
import { ValidatePipe } from "./validate.pipe.js";
import { TestFilter } from "./test.filter.js";
import session from "express-session";
import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { HttpException, HttpStatus, ParseIntPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    cors: true,
  });
  // const app = await NestFactory.create<NestFastifyApplication>(AppModule);
  app.useStaticAssets("public", { prefix: "/static" });
  app.setBaseViewsDir("views");
  app.setViewEngine("hbs");
  // app.use((req: Request, res: Response, next: Function) => {
  //   console.log("before", req.url);
  //   next();
  //   console.log("after", req.url);
  // });
  // const loginGuard = app.get(LoginGuard);
  // app.useGlobalGuards(loginGuard);
  // app.useGlobalGuards(new LoginGuard());
  // const timeInterceptor = app.get(TimeInterceptor);
  // app.useGlobalInterceptors(timeInterceptor);
  // const parseIntPipe = app.get(ParseIntPipe);
  // app.useGlobalPipes(parseIntPipe);
  // app.useGlobalPipes(new ParseIntPipe({
  //   errorHttpStatusCode: 400,
  //   exceptionFactory: (msg) => {
  //     throw new HttpException(msg + " must be a number", HttpStatus.BAD_REQUEST);
  //   }
  // }));
  // const testFilter = app.get(TestFilter);
  // app.useGlobalFilters(testFilter);
  // app.useGlobalFilters(new TestFilter())
  app.use(session({
    secret: "hao",
    cookie: {
      maxAge: 100000
    }
  }));
  await app.listen(process.env.PORT ?? 3000);

  // setTimeout(() => {
  //   app.close();
  // }, 3000)
}
await bootstrap();