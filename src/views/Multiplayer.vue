<template>
  <div>
    <board :board="board" v-on:makeMove="makeMoveEvent" />
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import { computed, defineComponent, ref, inject, onBeforeUnmount } from 'vue';
import Board from '@/components/Board.vue';
import { Logger } from '@/types/Types';
import { ToastKey } from '../plugins/toast/Toast';
import {
  setConnection,
  state,
  connection,
  addMessageListener,
  sendMessage,
  closeConnection,
} from '../composables/WebSocket';
import useBoard from '../composables/Board';

const WS_URL = process.env.VUE_APP_WS_URL;

export default defineComponent({
  components: { Board },
  name: 'Multiplayer',

  setup() {
    const logger = inject('vuejs3-logger') as Logger;

    const toast = inject(ToastKey, () => {
      logger.error('TOAST NOT FOUND');
    });
    /**
     * Router setup
     */
    const route = useRoute();
    const { id } = route.params;

    /**
     * Game setup
     */
    const { board, setBoard } = useBoard();
    const playerSign = ref('');
    const nextPlayer = ref('');
    const gameStatus = ref('RUNNING');

    /**
     * SOCKET
     */
    const token = sessionStorage.getItem(String(id));
    setConnection(`${WS_URL}/${id}/${token}`);
    addMessageListener((event: MessageEvent) => {
      const msg = JSON.parse(JSON.parse(event.data));

      switch (msg.messageType) {
        case 'GAME_PLAYER_JOINED': {
          setBoard(msg.board);
          playerSign.value = msg.playerSign;
          nextPlayer.value = msg.nextPlayer;
          gameStatus.value = msg.gameStatus;
          toast({ type: 'success', text: 'Player joined' });

          break;
        }
        case 'GAME_PLAYER_MOVED': {
          setBoard(msg.board);
          nextPlayer.value = msg.nextPlayer;
          gameStatus.value = msg.gameStatus;
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

    onBeforeUnmount(() => {
      closeConnection();
    });

    /**
     * USER FUNCTIONS
     */

    const canMove = computed(() => {
      return gameStatus.value === 'RUNNING' && nextPlayer.value === playerSign.value;
    });

    const makeMoveEvent = ({ x, y }: { x: number; y: number }) => {
      if (canMove.value) {
        const newBoard = JSON.parse(JSON.stringify(board.value));
        newBoard[y][x] = playerSign.value;
        const boardStr = newBoard.join().replaceAll(',', '');
        sendMessage(
          JSON.stringify({
            messageType: 'GAME_MOVE',
            message: boardStr,
          })
        );
      }
    };

    return {
      state,
      connection,
      board,
      makeMoveEvent,
    };
  },
});
</script>
