<template>
  <div>
    <board v-on:makeMove="makeMove" :board="board"></board>
  </div>
</template>

<script lang="ts">
import { useRoute } from 'vue-router';
import { defineComponent, ref, inject } from 'vue';
import Board from '@/components/Board.vue';
import { Logger } from '@/types/Types';
import { getGame, updateGame, setToken } from '../composables/SinglePlayerAPI';

export default defineComponent({
  components: { Board },
  name: 'SinglePlayer',
  setup() {
    const route = useRoute();
    const logger = inject('vuejs3-logger') as Logger;

    // Get game id
    const { id } = route.params;

    // Get auth token
    let { token } = route.params;

    if (!token && localStorage.getItem('token')) {
      token = String(localStorage.getItem('token'));
    }

    setToken(String(token));

    const board = ref([
      ['-', '-', '-'],
      ['-', '-', '-'],
      ['-', '-', '-'],
    ]);

    const setBoard = (value: string) => {
      const root = Math.sqrt(value.length);
      const newBoard = [];
      for (let i = 0; i < root; i += 1) {
        const row = [];
        for (let j = 0; j < root; j += 1) {
          const idx = j + i * root;
          row.push(value.charAt(idx));
        }
        newBoard.push(row);
      }
      board.value = newBoard;
    };

    if (typeof id === 'string' && typeof token === 'string') {
      localStorage.setItem('token', token);
      getGame(id).then((game) => {
        setBoard(game.Board);
      });
    }

    const makeMove = ({ x, y }: { x: number; y: number }) => {
      const newBoard = board.value;
      newBoard[y][x] = 'X';
      const boardStr = newBoard.join().replaceAll(',', '');
      const request = {
        ID: String(id),
        Board: boardStr,
        Status: '',
        NextPlayer: '',
      };
      updateGame(request)
        .then((response) => {
          setBoard(response.Board);
        })
        .catch((error) => {
          logger.debug(error);
        });
    };

    return { board, setBoard, makeMove };
  },
});
</script>
<style scoped>
.board {
  width: 400px;
  height: 400px;
  margin: auto;
}
td {
  border: 1px solid black;
}
</style>
