<template>
  <div
    class="chat"
    ref="chat"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <div class="chatBody" ref="chatBody" :style="bodyStyle">
      <div class="history" v-for="history in histories" :key="history.id">
        <div class="question">{{ history.question }}</div>
        <div class="answer">{{ history.answer }}</div>
      </div>
      <div class="divider">
        <div class="line"></div>
        <div class="text">下拉查看历史会话</div>
        <div class="line"></div>
      </div>
      <div class="session" v-for="session in sessions" :key="session.id">
        <div class="question">{{ session.question }}</div>
        <div class="answer">{{ session.answer }}</div>
      </div>
      <div class="activeSession">
        <div class="question" v-if="activeSession?.question">{{ activeSession.question }}</div>
        <div class="answer" v-if="activeSession?.answer">{{ activeSession.answer }}</div>
        <div class="thinking" v-else-if="activeSession?.question">
          思考中<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated, ref, nextTick, computed } from "vue"
import { storeToRefs } from "pinia"
import { useSocketStore } from "@/store/socket"

const chat = ref<HTMLDivElement | null>()
const chatBody = ref<HTMLDivElement | null>()
const pullIndicator = ref<HTMLDivElement | null>()
const socketStore = useSocketStore()

const { histories, sessions, activeSession } = storeToRefs(socketStore)

// 下拉加载逻辑
const pullDistance = ref(0)
const touchStartY = ref(0)
const isAtTop = ref(false)
const pulling = ref(false)

const bodyStyle = computed(() => {
  if (pullDistance.value > 0) {
    return { transform: `translateY(${pullDistance.value}px)` }
  }
  return {}
})

// 检查是否在顶部
const checkAtTop = () => {
  if (!chat.value) {
    return
  }
  isAtTop.value = chat.value.scrollTop <= 0
}

const onTouchStart = (e: TouchEvent) => {
  checkAtTop()
  if (!isAtTop.value || socketStore.historyLoading) {
    return
  }

  touchStartY.value = e.touches[0].clientY
  pulling.value = true
  chat.value.style.overflow = "hidden"
}

const onTouchMove = (e: TouchEvent) => {
  if (!socketStore.historyHasMore || !pulling.value) {
    return
  }

  const delta = e.touches[0].clientY - touchStartY.value
  if (delta <= 0) {
    pullDistance.value = 0
    return
  }
  
  // 阻力系数：拉得越远阻力越大
  const resisted = delta * 0.3
  pullDistance.value = Math.min(resisted, 60)
  e.preventDefault()
}

const onTouchEnd = () => {
  if (!pulling.value) {
    return
  }

  pulling.value = false
  chat.value.style.overflow = ""

  if (socketStore.historyHasMore && !socketStore.historyLoading) {
    const prevScrollHeight = chat.value.scrollHeight
    socketStore.loadMoreHistory()
    nextTick(() => {
      // 保持滚动位置不变
      const newScrollHeight = chat.value.scrollHeight
      chat.value.scrollTop = newScrollHeight - prevScrollHeight
      releasePull()
    })
  } else {
    releasePull()
  }
}

const releasePull = () => {
  pullDistance.value = 0
}

// 自动滚动到底部
const autoScrollToBottom = () => {
  chat.value.scrollTop = chat.value.scrollHeight
}

onMounted(() => {
  autoScrollToBottom()
})

onUpdated(() => {
  autoScrollToBottom()
})
</script>

<style scoped lang="less">
.chat {
  width: 100%;
  height: 460px;
  flex-shrink: 0;
  margin-top: 30px;
  overflow: auto;
  -webkit-overflow-scrolling: touch;

  display: flex;
  flex-direction: column;

  .chatBody {
    will-change: transform;
    transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: flex;
    flex-direction: column;
  }

  .history, .session, .activeSession {
    margin: 12px 12px 0;
    .question {
      width: fit-content;
      max-width: 80%;
      margin-left: auto;
      padding: 16px;
      border-radius: 12px 12px 4px 12px;
      background: #fff;
    }
    .answer, .thinking {
      margin-top: 12px;
      padding: 16px;
      border-radius: 4px 12px 12px 12px;
      background: #fff;
      opacity: 0.8;
    }
    .thinking {
      display: flex;
      align-items: center;
      .dot {
        display: inline-block;
        font-size: 24px;
        font-weight: bold;
        animation: bounce 1.4s ease-in-out infinite both;
        &:nth-child(1) { animation-delay: -0.32s; }
        &:nth-child(2) { animation-delay: -0.16s; }
        &:nth-child(3) { animation-delay: 0s; }
      }
    }
  }
  .divider {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 8px 0px 8px;
    .line {
      flex-grow: 1;
      height: .5px;
      background: #bdc2c6;
      opacity: 0.8;
    }
    .text {
      margin: 0 12px;
      font-size: 10px;
      color: #bdc2c6;
      opacity: 0.8;
      white-space: nowrap;
    }
  }
  .session {
    flex-grow: 1;
  }
}

@keyframes bounce {
  0%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-12px); }
}
</style>