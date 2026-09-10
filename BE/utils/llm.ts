import OpenAI from "openai"

const openai = new OpenAI({
  baseURL: "http://localhost:11434/v1",
  apiKey: "ollama",
})

const llm = async (prompt: string, onChunk: (chunk: string) => void) => {
  const stream = await openai.chat.completions.create({
    model: "deepseek-r1",
    messages: [
      {
        role: "system",
        content: "你是一个专业的美食博主",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    stream: true,
  })

  // 异步等待每一个chunk，将content拼接起来，返回完整的字符串
  let fullContent = ""
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || ""
    if (content) {
      fullContent += content
      onChunk(content)
    }
  }
  return fullContent
}

export default llm