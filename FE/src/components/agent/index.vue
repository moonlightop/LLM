<template>
  <div class="agent">
    <div v-for="agent in agents" :key="agent.name" class="item">
      <img :src="agent.icon" alt="智能体图标" class="icon">
      <div class="text">
        <div class="name">{{ agent.name }}</div>
        <div class="desc">{{ agent.desc }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const agents = [
  {
    name: "美食",
    icon: require("@/assets/imgs/food.png"),
    desc: "懂你的口味，更懂你想吃什么",
  },
  {
    name: "旅游",
    icon: require("@/assets/imgs/travel.png"),
    desc: "从攻略到行程，陪你走好每一段路",
  },
  {
    name: "运动",
    icon: require("@/assets/imgs/sports.png"),
    desc: "科学训练，陪你动起来",
  }
]
</script>
<style scoped lang="less">
.agent {
  width: 100%;
  flex-shrink: 0;
  padding-left: 16px;
  margin-top: 16px;

  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    align-items: center;
    margin-top: 14px;
    .icon {
      width: 50px;
      border-radius: 50%;
    }
    .text {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
      .name {
        font-size: 16px;
      }
      .desc {
        font-size: 14px;
        color: #282727;
        margin-top: 4px;
      }
    }
  }
}
</style>