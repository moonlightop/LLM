
ollama
```shell
# 模型1000h常驻内存
ollama run deepseek-r1 --keepalive 1000h
# 模型临时常驻内存
ollama run deepseek-r1
# 停止模型运行
ollama stop deepseek-r1
```

ts路径别名
> [typescript 的路径别名问题详解与前世今生](https://juejin.cn/post/7116783579677327397)

流式输出
```json
{ type: "TEXT_START" }
{ type: "TEXT_CHUNK" }
{ type: "TEXT_CHUNK" }
{ type: "TEXT_END" }
```