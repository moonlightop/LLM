import { BeforeApplicationShutdown, HttpException, MiddlewareConsumer, Module, NestModule, OnApplicationBootstrap, OnApplicationShutdown, OnModuleDestroy, OnModuleInit, ParseIntPipe } from "@nestjs/common";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { UserModule } from "./user/user.module.js";
import { LogMiddleware } from "./log.middleware.js";
import { ExceptionMiddleware } from "./exception.middleware.js";
import { LoginGuard } from "./login.guard.js";
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { TimeInterceptor } from "./time.intercept.js";
import { ValidatePipe } from "./validate.pipe.js";
import { TestFilter } from "./test.filter.js";
import { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } from "./user/user.configurable.js";

@Module({
  imports: [
    UserModule.registerAsync({ name: "AppModule" }),
    {
      ...ConfigurableModuleClass.register({ name: "AppModule", isGlobal: true }),
      exports: [MODULE_OPTIONS_TOKEN]
    },
    {
      ...ConfigurableModuleClass.registerAsync({
        async useFactory() {
          await new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve("");
            })
          })
          return {
            name: "AppModule-async"
          }
        }
      }),
      exports: [MODULE_OPTIONS_TOKEN]
    }
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // ParseIntPipe,
    // {
    //   provide: APP_PIPE,
    //   useValue: new ParseIntPipe({
    //     errorHttpStatusCode: 400,
    //     exceptionFactory(msg) {
    //       throw new HttpException(msg + " must be a number", 400);
    //     }
    //   }),
    // },
    // TimeInterceptor,
    // ValidatePipe,
    // {
    //   provide: APP_GUARD,
    //   useClass: LoginGuard
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: TimeInterceptor
    // },
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidatePipe
    // },
    // {
    //   provide: APP_FILTER,
    //   useClass: TestFilter
    // },
    {
      provide: "app_service",
      useClass: AppService
    },
    {
      provide: "user",
      useValue: {
        name: "hao",
        age: 26
      }
    },
    {
      provide: "factory",
      async useFactory(appService: AppService, user: { name: string, age: number }) {
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve("");
          })
        })
        return {
          name: appService.getHello(),
          age: user.age
        }
      },
      inject: ["app_service", "user"]
    },
    {
      provide: "appService",
      useExisting: "app_service"
    }
  ],
})
export class AppModule extends ConfigurableModuleClass implements OnModuleInit,
  OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown,
  NestModule {
  async onModuleInit() {
    console.log("onModuleInit-AppModule");
  }

  async onApplicationBootstrap() {
    console.log("onApplicationBootstrap-AppModule");
  }

  async onModuleDestroy() {
    console.log("onModuleDestroy-AppModule");
  }

  async beforeApplicationShutdown(signal: string) {
    console.log("beforeApplicationShutdown-AppModule", signal);
  }

  async onApplicationShutdown() {
    console.log("onApplicationShutdown-AppModule");
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware, ExceptionMiddleware)
      .forRoutes("aaa/{*path}");
  }
}