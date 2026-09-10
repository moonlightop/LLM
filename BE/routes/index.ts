import Router from "koa-router"
import llmRouter from "./llm"

const router = new Router()

router.post("/llm", llmRouter)

export default router
