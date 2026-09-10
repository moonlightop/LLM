<template>
  <div class="swiper" :style="{ transform: `translateX(-${activeIndex * 100}%)` }">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue"

interface IActiveIndex {
  activeIndex: number
}
const props = withDefaults(defineProps<IActiveIndex>(), {
  activeIndex: 0
})
const { activeIndex } = toRefs(props)
</script>
<style scoped lang="less">
.swiper {
  display: flex;

  transition: transform 0.3s ease-in-out;
}
</style>
