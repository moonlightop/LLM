import { BeforeApplicationShutdown, DynamicModule, Module, NestModule, OnApplicationBootstrap, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TimeInterceptor } from "../time.intercept.js";

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TimeInterceptor
    // }
  ],
})
export class UserModule implements OnModuleInit,
  OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
  
  static registerAsync(options: Record<string, any>): DynamicModule {
    return {
      module: UserModule,
      imports: [],
      controllers: [UserController],
      providers: [
        {
          provide: "CONFIG_OPTIONS",
          useValue: options
        },
        UserService,
      ],
      exports: ["CONFIG_OPTIONS"]
    }
  }

   async onModuleInit() {
    console.log("onModuleInit-UserModule");
  }

  async onApplicationBootstrap() {
    console.log("onApplicationBootstrap-UserModule");
  }

  async onModuleDestroy() {
    console.log("onModuleDestroy-UserModule");
  }

  async beforeApplicationShutdown(signal: string) {
    console.log("beforeApplicationShutdown-UserModule", signal);
  }

  async onApplicationShutdown() {
    console.log("onApplicationShutdown-UserModule");
  }
}