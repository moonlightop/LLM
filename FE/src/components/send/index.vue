<template>
  <div class="send">
    <div class="tools">
      <div class="directives"></div>
      <div class="textInput" ref="textInput" contenteditable="true" data-placeholder="有什么需要问我的吗 ~"></div>
      <div class="sendBtn" @click="sendHandler"></div>
      <div class="voice"></div>
    </div>
    <div class="tip">内容由AI生成</div>
  </div>
</template>
<script setup lang="ts">
import { toRefs, defineProps, ref } from "vue"

interface ISendProps {
  sendText: (text: string) => void
}

const props = defineProps<ISendProps>()
const { sendText } = toRefs(props)

const textInput = ref(null)
const sendHandler = (e: MouseEvent) => {
  const text = textInput.value.textContent
  console.log("sendHandler", text)
  if (!text) {
    return
  }
  sendText.value(text)
  textInput.value.textContent = ""
}

</script>
<style scoped lang="less">
.send {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;

  margin: 0 16px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .tools {
    flex-grow: 1;

    box-sizing: border-box;
    width: 100%;
    border-radius: 25px;
    background: #fff;

    display: flex;
    align-items: center;
    .directives {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      margin: 6px;
    
      background-image: url("@/assets/imgs/stars.png");
      background-size: cover;
    }
    .textInput {
      flex-grow: 1;
      width: 200px;
      max-height: 100px;
      padding: 6px;
      margin: 6px;

      overflow: auto;
      outline: none;
      caret-color: blue;
      white-space: pre-wrap;
    }
    .textInput:empty::before {
      content: attr(data-placeholder);
      color: #bdc2c6;
      pointer-events: none;
    }
    .sendBtn {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      margin-right: 10px;

      background-image: url("@/assets/imgs/send.png");
      background-size: cover;
    }
    .voice {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      margin-right: 10px;

      background-image: url("@/assets/imgs/voice.png");
      background-size: cover;
    }
  }
  .tip {
    flex-shrink: 0;
    margin: 10px auto;

    font-size: 10px;
    color: #bdc2c6;
    opacity: 0.8;
  }
}
</style>