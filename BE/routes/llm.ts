
import Koa from "koa"
import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
})

const llmRouter = async (ctx: Koa.Context, next: Koa.Next) => {
  const completion = await openai.chat.completions.create({
    model: "deepseek-r1",
    messages: [
      {
        role: "system",
        content: "你是一个专业的美食博主"
      },
      {
        role: "user",
        content: "清远有名的美食有哪些"
      }
    ]
  })
  ctx.body = completion.choices[0].message.content
}

export default llmRouter
