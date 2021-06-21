<template>
  <div class="game-list">
    <div v-for="(g, key) in games" :key="key" class="nes-container with-title is-centered is-rounded">
      <p class="title">{{ g.gameId }}</p>
      <p>
        {{ g.playerCount }}/2 players.
        <button type="button" class="nes-btn" v-if="g.playerCount < 2" @click="joinGame(g)">JOIN</button>
      </p>
    </div>
    <div class="empty-games" v-if="games.length == 0">
      <section class="message">
        <i class="nes-bcrikko"></i>
        <div class="nes-balloon from-left">
          <p>No games yet.</p>
        </div>
      </section>
    </div>
    <button type="button" class="nes-btn is-primary create-game" @click="createGame">CREATE GAME</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { setConnection, addMessageListener, closeConnection, sendMessage } from '../composables/WebSocket';

type LobbyGame = { gameId: string; playerCount: number };
const WS_URL = process.env.VUE_APP_WS_URL;

export default defineComponent({
  name: 'GameList',

  setup() {
    const router = useRouter();

    const games = ref<LobbyGame[]>([]);
    const setGames = (value: LobbyGame[]) => {
      games.value = value;
    };

    /**
     * SOCKET
     */
    setConnection(WS_URL);
    addMessageListener((event: MessageEvent) => {
      const msg = JSON.parse(JSON.parse(event.data));
      switch (msg.messageType) {
        case 'LOBBY_JOIN': {
          setGames([...msg.games]);
          break;
        }
        case 'UPDATE_LOBBY': {
          setGames([...msg.games]);
          break;
        }

        case 'LOBBY_NEW_GAME': {
          setGames([...msg.games]);
          break;
        }
        case 'LOBBY_JOINED_GAME': {
          closeConnection();
          const parts = msg.message.split(':');

          sessionStorage.setItem(parts[0], parts[1]);
          router.push({ name: 'Multiplayer', params: { id: parts[0] } });
          break;
        }

        default:
      }
    });

    onBeforeUnmount(() => {
      closeConnection();
    });

    /**
     * USER FUNCTIONS
     */

    const createGame = () => {
      const createGameMsg = { messageType: 'CREATE_GAME', message: '' };
      sendMessage(JSON.stringify(createGameMsg));
    };
    const joinGame = (game: LobbyGame) => {
      if (sessionStorage.getItem(game.gameId)) {
        router.push({ name: 'Multiplayer', params: { id: game.gameId } });
      } else {
        const joinGameMsg = { messageType: 'JOIN_GAME', message: game.gameId };
        sendMessage(JSON.stringify(joinGameMsg));
      }
    };
    return {
      joinGame,
      createGame,
      games,
    };
  },
});
</script>

<style lang="scss" scoped>
.game-list {
  margin: auto;
  max-width: 480px;
  padding: 15px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-content: space-around;
}
.message {
  display: flex;
  margin: auto;
  max-width: 320px;
}
.empty-games {
  height: 320px;
  display: flex;
  flex-direction: column;
}
.create-game {
  margin-top: 2em;
}
</style>
