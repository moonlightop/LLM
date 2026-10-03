import { BadRequestException, BeforeApplicationShutdown, Controller, forwardRef, Get, Header, Headers, HostParam, HttpCode, HttpException, HttpStatus, Inject, Ip, Next, OnApplicationBootstrap, OnApplicationShutdown, OnModuleDestroy, OnModuleInit, Optional, ParseIntPipe, Query, Redirect, Render, Req, Res, Session, SetMetadata, UseFilters, UseGuards, UseInterceptors, UsePipes, Version, VERSION_NEUTRAL } from "@nestjs/common";
import { AppService } from "./app.service.js";
import { ModuleRef } from "@nestjs/core";
import { LoginGuard } from "./login.guard.js";
import { TimeInterceptor } from "./time.intercept.js";
import { TestFilter } from "./test.filter.js";
import type { Request, Response } from "express";
import { Roles } from "./roles.decorator.js";
import { Auth } from "./Auth.decorator.js";
import { MyHeaders } from "./param.decorator.js";
import { MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from "./user/user.configurable.js";

// @Controller({ host: ":host.0.0.1", path: "/" })
// @SetMetadata("role", ["user"])
// @Roles("user")
@Auth("user")
@Controller()
// @UsePipes(new ParseIntPipe({
//   errorHttpStatusCode: 400,
//   exceptionFactory: (msg) => {
//     throw new HttpException(msg + " must be a number", HttpStatus.BAD_REQUEST);
//   }
// }))
export class AppController implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
  constructor(
    @Optional() @Inject(forwardRef(() => AppService)) private readonly appService: AppService,
    private readonly moduleRef: ModuleRef,
    // @Inject("app_service") private readonly app_service: AppService,
    // @Inject("user") private readonly user: { name: string, age: number },
    // @Inject("factory") private readonly factory: { name: string, age: number },
    // @Inject("appService") private readonly appService1: AppService
  ) {}

  @Optional()
  @Inject(AppService)
  private readonly appService2: AppService;
  @Inject("app_service")
  private readonly app_service3: AppService;
  @Inject("CONFIG_OPTIONS")
  private readonly configOptions: Record<string, any>;
  @Inject(MODULE_OPTIONS_TOKEN)
  private readonly moduleOptions: typeof OPTIONS_TYPE;
  // @Inject("user")
  // private readonly user2: { name: string, age: number };
  // @Inject("factory")
  // private readonly factory2: { name: string, age: number };
  // @Inject("appService")
  // private readonly appService3: AppService;

  async onModuleInit() {
    console.log("onModuleInit-Controller");
  }

  async onApplicationBootstrap() {
    console.log("onApplicationBootstrap-Controller");
  }

  async onModuleDestroy() {
    console.log("onModuleDestroy-Controller");
  }

  async beforeApplicationShutdown(signal?: string) {
    console.log("beforeApplicationShutdown-Controller", signal);
  }

  async onApplicationShutdown() {
    const appService = this.moduleRef.get<AppService>(AppService);
    console.log(appService.getHello());
    console.log("onApplicationShutdown-Controller");
  }

  @Get("dynamic")
  getDynamic() {
    console.log(this.configOptions.name, this.moduleOptions.name);
    return this.configOptions.name + this.moduleOptions.name;
  }

  @Get("test")
  @Render("user2")
  getTest() {
    return {
      name: "hao",
      age: 26
    };
  }

  @Get()
  getHello(@Ip() ip: string, @Session() session: any) {
    if (!session.count) {
      session.count = 1;
    }

    session.count++;
    return session.count;
  }

  @Get("aaa/path")
  @UseGuards(LoginGuard)
  // @UseInterceptors(TimeInterceptor)
  // @SetMetadata("role", ["admin"])
  @Roles("admin", "super_admin")
  @UseFilters(TestFilter)
  getAaa(@MyHeaders() headers: any, @MyHeaders("accept") accept: string) {
    throw new BadRequestException("aaa error");
    console.log(headers, accept)
    return "aaa";
  }

  @Get("bbb")
  getBbb2(@Next() next: Function) {
    console.log("bbb2");
    next();
  }

  @Get("bbb")
  getBbb1(@Next() next: Function) {
    console.log("bbb1");
    next();
  }

  @Get("bbb")
  @Version(VERSION_NEUTRAL)
  getBbb(@Req() req: Request, @Res({ passthrough: true }) res: Response, @HostParam("host") host: string) {
    console.log("bbb0");
    // res.end("end");
    // res.send("send");
    // res.json({ name: "hao", age: 26 });
    return "bbb";
  }

  @Get("ccc")
  getCcc(@Query("num") num: number) {
    return num;
  }
}