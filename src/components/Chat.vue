<template>
  <div class="chat nes-container">
    <ul class="chat-messages">
      <li class="chat-message" v-for="(msg, key) in messages" :key="key">
        <span class="chat-message__timestamp"> {{ msg.timestamp }}</span> {{ msg.sender.name || msg.sender.id }}:{{
          msg.message
        }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Logger } from '@/types/Types';
import { ToastKey } from '../plugins/toast/Toast';
import { addMessageListener } from '../composables/WebSocket';

type Sender = { id: string; name: string };
type ChatMessage = { message: string; sender: Sender; timestamp: string };

export default defineComponent({
  name: 'Chat',
  setup() {
    const logger = inject('vuejs3-logger') as Logger;

    const toast = inject(ToastKey, () => {
      logger.error('TOAST NOT FOUND');
    });
    const messages = ref<ChatMessage[]>([]);

    addMessageListener((event: MessageEvent) => {
      const msg = JSON.parse(JSON.parse(event.data));

      switch (msg.messageType) {
        case 'CHAT_MESSAGE': {
          messages.value.push({
            message: msg.message,
            sender: msg.sender,
            timestamp: msg.timestamp,
          });
          break;
        }
        case 'UPDATE_PLAYER_NAME': {
          messages.value = messages.value.map((m) =>
            m.sender.id === msg.player.id ? { ...m, sender: { ...m.sender, name: msg.player.name } } : m
          );
          break;
        }
        case 'GAME_ERR_MESSAGE': {
          if (toast) {
            toast({ type: 'error', text: msg.message });
          }
          break;
        }
        default:
      }
    });
    return { messages };
  },
});
</script>
<style scoped>
.chat {
  background-color: rgb(204, 204, 204);
  width: 100%;
  grid-row: 2;
  grid-column: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  margin-right: 10px;
}
.chat-messages {
  height: 100%;
  width: 100%;
  margin-left: 10px;
  padding-left: 0px;
  text-align: left;
}
.chat-message {
  list-style: none;
  padding-bottom: 2px;
}
.chat-message__timestamp {
  font-size: 0.8rem;
}
</style>
