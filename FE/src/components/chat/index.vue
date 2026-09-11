<template>
  <div class="chat">
    <div class="history">123</div>
    <div class="divider">
      <div class="line"></div>
      <div class="text">下拉查看历史会话</div>
      <div class="line"></div>
    </div>
    <div class="record">123</div>
  </div>
</template>
<script setup lang="ts"></script>
<style scoped lang="less">
.chat {
  width: 100%;
  flex-shrink: 0;
  margin-top: 30px;
  overflow: auto;

  display: flex;
  flex-direction: column;
  .history {

  }
  .divider {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px;
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
  .record {
    flex-grow: 1;
  }
}
</style>