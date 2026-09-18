<template>
  <div class="chat" ref="chat">
    <div class="history" v-for="history in histories" :key="history">
      <div class="question">{{ history.question }}</div>
      <div class="answer">{{ history.answer }}</div>
    </div>
    <div class="divider">
      <div class="line"></div>
      <div class="text">下拉查看历史会话</div>
      <div class="line"></div>
    </div>
    <div class="session" v-for="session in sessions" :key="session">
      <div class="question">{{ session.question }}</div>
      <div class="answer">{{ session.answer }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue"
import { storeToRefs } from "pinia"
import { useSocketStore } from "@/store/socket"

const chat = ref<HTMLDivElement|null>()
const socketStore = useSocketStore()

const { histories, sessions, activeSession } = storeToRefs(socketStore)

onMounted(() => {
  chat.value.scrollTop = chat.value.scrollHeight
})
</script>
<style scoped lang="less">
.chat {
  width: 100%;
  height: 460px;
  flex-shrink: 0;
  margin-top: 30px;
  overflow: auto;

  display: flex;
  flex-direction: column;
  .history, .session {
    margin: 12px 12px 0;
    .question {
      width: fit-content;
      max-width: 80%;
      margin-left: auto;
      padding: 16px;
      border-radius: 12px 12px 4px 12px;
      background: #fff;
    }
    .answer {
      margin-top: 12px;
      padding: 16px;
      border-radius: 4px 12px 12px 12px;
      background: #fff;
      opacity: 0.5;
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
    }
  }
  .session {
    flex-grow: 1;
  }
}
</style>