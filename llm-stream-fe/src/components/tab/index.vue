<template>
  <div class="tab">
    <slot></slot>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="less">
.tab {
  width: 100%;
  display: flex;
  align-items: center;

  font-size: 16px;
}
</style>
