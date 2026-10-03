import { BeforeApplicationShutdown, Injectable, OnApplicationBootstrap, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from "@nestjs/common";

@Injectable()
export class AppService implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, OnApplicationShutdown, BeforeApplicationShutdown {

  async onModuleInit() {
    console.log("onModuleInit-Service");
  }
  
  async onApplicationBootstrap() {
    console.log("onApplicationBootstrap-Service");
  }

  async onModuleDestroy() {
    console.log("onModuleDestroy-Service");
  }

  async beforeApplicationShutdown(signal?: string) {
    console.log("beforeApplicationShutdown-Service", signal);
  }

  async onApplicationShutdown() {
    console.log("onApplicationShutdown-Service");
  }

  getHello(): string {
    return "Hello World!";
  }
}
