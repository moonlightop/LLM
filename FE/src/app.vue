<template>
  <div class="container">
    <tab>
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="[`${tab.key}Tab`, { active: activeTab === tab.key }]"
        @click="changeActiveTab(tab.key)"
      >{{ tab.label }}</div>
    </tab>
    <swiper :activeIndex="activeIndex">
      <life />
      <chat />
      <agent />
    </swiper>
    <send :sendText="sendText" />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, onUpdated, ref } from "vue"

import tab from "@/components/tab/index.vue"
import swiper from "@/components/swiper/index.vue"
import life from "@/components/life/index.vue"
import chat from "@/components/chat/index.vue"
import agent from "@/components/agent/index.vue"
import send from "@/components/send/index.vue"

import network from "@/config/network.json"
import useWs from "@/hooks/useWs"

// env
console.log(process.env.NODE_ENV)

// websocket logic
const ws = ref(null)
const connectWs = () => {
  const wsUrl = network[process.env.NODE_ENV].wsUrl
  const socket = useWs(wsUrl)
  ws.value = socket
}
const sendText = (text: string) => {
  if (ws.value) {
    ws.value.sendText(text)
  }
}
onMounted(() => {
  connectWs()
})

// active tab logic
const tabs = [
  { key: "life", label: "生活" },
  { key: "chat", label: "对话" },
  { key: "agent", label: "智能体" },
] as const

const activeTab = ref("life")
const activeIndex = computed(() =>tabs.findIndex((tab) => tab.key === activeTab.value))
const changeActiveTab = (key: string) => {
  activeTab.value = key
}
</script>
<style scoped lang="less">
@import "./assets/css/normalize.css";

.container {
  width: 100vw;
  height: 100vh;
  border-radius: 4px;

  background: url("./assets/imgs/bg.png") no-repeat center center;
  background-size: cover;

  display: flex;
  flex-direction: column;
  overflow: hidden;

  ::v-deep .tab {
    padding-top: 34px;
    margin-left: 20px;
  }
  .lifeTab {
    opacity: 0.5;
  }
  .chatTab {
    margin-left: 20px;
    opacity: 0.5;
  }
  .agentTab {
    margin-left: 20px;
    opacity: 0.5;
  }
  .active {
    transition: all 0.3s ease-in-out;

    opacity: 1;
    scale: 1.2;
    font-weight: 500;
  }

  ::v-deep .swiper {
    flex-grow: 1;
  }
}
</style>