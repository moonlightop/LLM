<template>
  <div class="life">
    <div class="title">{{ title }}</div>
    <div class="desc">{{ desc }}</div>
  </div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from "vue"

import { queryMiscWeather } from "@/api"

const weatherRes = ref(null)
const title = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 6 && hour < 12) {
    return "早上好"
  } else if (hour >= 12 && hour < 14) {
    return "中午好"
  } else if (hour >= 14 && hour < 18) {
    return "下午好"
  } else {
    return "晚上好"
  }
})
const desc = computed(() => {
  if (!weatherRes.value) {
    return ""
  }

  // 清远市天气晴，温度26℃
  return `${weatherRes.value.city}天气${weatherRes.value.weather}，温度${weatherRes.value.temperature}℃`
})
onBeforeMount(async () => {
  weatherRes.value = await queryMiscWeather()
  console.log(weatherRes.value)
})
</script>
<style scoped lang="less">
.life {
  width: 100%;
  flex-shrink: 0;

  .title {
    font-size: 24px;  
    font-weight: 500;
    margin-top: 34px;
  }
  .desc {
    margin-top: 14px;
  }
}
</style>