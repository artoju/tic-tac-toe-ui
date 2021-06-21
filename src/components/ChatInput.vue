<template>
  <div class="chat-input">
    <input
      @keydown.enter.exact.prevent="sendChatMessage"
      v-model.trim="message"
      class="chat-input__textarea nes-textarea"
    />
    <button @click="sendChatMessage" type="button" class="chat-input__button nes-btn is-primary">SEND</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { sendMessage, state } from '../composables/WebSocket';

export default defineComponent({
  name: 'ChatInput',
  setup() {
    const message = ref('');
    const sendChatMessage = () => {
      const chatMessage = {
        messageType: 'CHAT_MESSAGE',
        message: message.value,
      };
      sendMessage(JSON.stringify(chatMessage));
      message.value = '';
    };

    return { sendChatMessage, message, state };
  },
});
</script>

<style scoped>
.chat-input {
  width: 100%;
  grid-row: 4;
  grid-column: 1/-1;
  display: flex;
  padding: 4px;
}
.chat-input__textarea {
  resize: none;
  width: 100%;
  padding: 4px 8px 4px 8px;
}
.chat-input__button {
  width: 25%;
}
</style>
