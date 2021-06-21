<template>
  <div class="start-screen">
    <div class="start-screen__buttons">
      <button type="button" class="nes-btn" @click="$router.push({ name: 'MainLobby' })">CHAT</button>
      <button type="button" class="nes-btn" @click="$router.push({ name: 'GameList' })">MULTIPLAYER</button>
      <button type="button" class="nes-btn" @click="playSinglePlayer">SINGLEPLAYER</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { useRouter } from 'vue-router';
import { Logger } from '@/types/Types';
import { startGame } from '../composables/SinglePlayerAPI';

export default defineComponent({
  name: 'StartScreen',
  setup() {
    const router = useRouter();
    const logger = inject('vuejs3-logger') as Logger;

    const playSinglePlayer = async () => {
      try {
        const response = await startGame();
        router.push({
          name: 'SinglePlayer',
          params: { id: response.ID, token: response.token },
        });
      } catch (error) {
        logger.debug(error);
      }
    };

    return {
      playSinglePlayer,
    };
  },
});
</script>

<style lang="scss" scoped>
.start-screen__buttons {
  max-width: 320px;
  height: 220px;
  margin: 10% auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.btn {
  height: 2rem;
  background-color: rgb(0, 255, 255);
  border-top: solid 4px rgb(193, 255, 255);
  border-left: solid 4px rgb(96, 218, 218);
  border-bottom: solid 4px rgb(50, 187, 187);
  border-right: solid 4px rgb(19, 165, 165);
}
</style>
