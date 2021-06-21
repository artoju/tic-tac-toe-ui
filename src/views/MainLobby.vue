<template>
  <div id="slider" class="grid swipe">
    <div class="grid-actions">
      <button type="button" class="nes-btn" @click="createGame">CREATE GAME</button>
      <button type="button" class="nes-btn" @click="initSinglePlayer">PLAY SINGLEPLAYER</button>
      <button type="button" class="nes-btn" @click="setName">SET NAME</button>
    </div>
    <div class="grid-list-header">players</div>
    <div class="grid-list">
      <player-list v-if="tabView === 'players'" :players="players"></player-list>
    </div>
    <chat />
    <chat-input />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, inject, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import ChatInput from '@/components/ChatInput.vue';
import { Logger } from '@/types/Types';
import { ToastKey } from '../plugins/toast/Toast';
import { ModalKey } from '../plugins/modal/Modal';
import { setConnection, addMessageListener, closeConnection, sendMessage } from '../composables/WebSocket';
import PlayerList from '../components/PlayerList.vue';
import Chat from '../components/Chat.vue';
import { startGame } from '../composables/SinglePlayerAPI';

const WS_URL = process.env.VUE_APP_WS_URL;
type Player = { name: string; id: string };

export default defineComponent({
  name: 'MainLobby',
  setup() {
    const router = useRouter();
    const logger = inject('vuejs3-logger') as Logger;
    const toast = inject(ToastKey, () => {
      logger.error('TOAST NOT FOUND');
    });
    const modal = inject(ModalKey, () => {
      logger.error('MODAL NOT FOUND');
    });
    /**
     * GAMES
     */
    const initSinglePlayer = async () => {
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

    /**
     * PLAYERS
     */
    const players = ref<Player[]>([]);
    const setPlayers = (value: Player[]) => {
      players.value = value;
    };
    const userId = ref('');
    const setUserId = (value: string) => {
      userId.value = value;
    };

    /**
     * SOCKET
     */
    setConnection(WS_URL);
    addMessageListener((event: MessageEvent) => {
      const msg = JSON.parse(JSON.parse(event.data));
      switch (msg.messageType) {
        case 'LOBBY_JOIN': {
          setPlayers([...msg.players, { id: msg.message, name: null }]);
          setUserId(msg.message);
          break;
        }
        case 'UPDATE_LOBBY': {
          setPlayers([...msg.players]);
          break;
        }
        case 'LOBBY_NEW_PLAYER': {
          setPlayers([...msg.players, { id: msg.message, name: null }]);
          break;
        }
        case 'UPDATE_PLAYER_NAME': {
          setPlayers(players.value.map((p) => (p.id === msg.player.id ? { ...p, name: msg.player.name } : p)));
          break;
        }
        case 'GAME_ERR_MESSAGE': {
          toast({ type: 'error', text: msg.message });
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

    const setName = () => {
      modal({
        type: 'input',
        text: 'Set name',
        callback({ confirm, input }: { confirm: boolean; input?: string }) {
          if (confirm) {
            const createGameMsg = { messageType: 'SET_NAME', message: input };
            sendMessage(JSON.stringify(createGameMsg));
          }
        },
      });
    };

    return {
      createGame,
      setName,
      players,
      initSinglePlayer,
    };
  },

  components: {
    PlayerList,
    Chat,
    ChatInput,
  },
});
</script>

<style lang="scss" scoped>
.grid {
  max-width: 760px;
  margin: auto;
  display: grid;
  grid-template-columns: auto 20%;
  grid-template-rows: 50px 70vh 1fr;
}
.grid-actions {
  display: flex;
}

.grid-list-header {
  width: 100%;
  padding-right: 5px;
  border: 1px solid black;
  border-bottom: none;
}
</style>
