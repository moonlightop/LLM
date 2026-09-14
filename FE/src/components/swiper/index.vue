<template>
  <div
    class="swiper"
    :style="swiperStyle"
    ref="swiperRef"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { toRefs, ref, computed } from "vue"

interface IActiveIndex {
  activeIndex: number
}
const props = withDefaults(defineProps<IActiveIndex>(), {
  activeIndex: 0
})
const { activeIndex } = toRefs(props)

const emit = defineEmits<{
  (e: "prev"): void
  (e: "next"): void
}>()

const SWIPE_THRESHOLD_PERCENT = 20
const MAX_DRAG_PERCENT = 100

const swiperRef = ref<HTMLElement | null>(null)
const startX = ref(0)
const startY = ref(0)
const dragOffset = ref(0)
const isDragging = ref(false)
const isTransitioning = ref(true)

const swiperStyle = computed(() => {
  const offset = -activeIndex.value * 100 + dragOffset.value
  return {
    transform: `translateX(${offset}%)`,
    transition: isTransitioning.value ? "transform 0.3s ease-in-out" : "none",
  }
})

const getContainerWidth = (): number => {
  return swiperRef.value?.clientWidth || 1
}

const calcDragPercent = (deltaX: number): number => {
  const containerWidth = getContainerWidth()
  let dragPercent = (deltaX / containerWidth) * 100

  // Boundary resistance: at first/last tab, drag feels heavier
  if (activeIndex.value === 0 && dragPercent > 0) {
    dragPercent /= 3
  } else if (activeIndex.value === 2 && dragPercent < 0) {
    dragPercent /= 3
  }

  return Math.max(-MAX_DRAG_PERCENT, Math.min(MAX_DRAG_PERCENT, dragPercent))
}

const startDrag = (x: number, y: number) => {
  startX.value = x
  startY.value = y
  dragOffset.value = 0
  isDragging.value = true
  isTransitioning.value = false
}

const moveDrag = (currentX: number, currentY: number) => {
  if (!isDragging.value) return

  const deltaX = currentX - startX.value
  const deltaY = currentY - startY.value

  // Ignore if gesture is mostly vertical (allow page scrolling)
  if (Math.abs(deltaX) < Math.abs(deltaY)) return

  dragOffset.value = calcDragPercent(deltaX)
}

const endDrag = (deltaX: number) =>{
  if (!isDragging.value) return
  isDragging.value = false
  isTransitioning.value = true

  const containerWidth = getContainerWidth()
  const dragPercent = (deltaX / containerWidth) * 100

  if (Math.abs(dragPercent) > SWIPE_THRESHOLD_PERCENT) {
    if (dragPercent < 0) {
      emit("next")
    } else {
      emit("prev")
    }
  }

  dragOffset.value = 0
}

const onTouchStart = (e: TouchEvent) => {
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  startDrag(currentX, currentY)
}

const onTouchMove = (e: TouchEvent) => {
  const currentX = e.touches[0].clientX
  const currentY = e.touches[0].clientY
  moveDrag(currentX, currentY)
}

const onTouchEnd = (e: TouchEvent) => {
  const currentX = e.changedTouches[0].clientX
  const deltaX = currentX - startX.value
  endDrag(deltaX)
}
</script>
<style scoped lang="less">
.swiper {
  display: flex;
  touch-action: pan-y;
  will-change: transform;
}
</style>