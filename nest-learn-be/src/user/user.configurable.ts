import { ConfigurableModuleBuilder } from "@nestjs/common";

interface AppModuleOptions {
  name: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } = new ConfigurableModuleBuilder<AppModuleOptions>()
  .setClassMethodName("register")
  .setExtras({
    isGlobal: true,
  }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  }))
  .build();