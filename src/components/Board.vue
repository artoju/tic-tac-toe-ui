<template>
  <table class="board">
    <tr v-for="(row, k) in board" :key="k">
      <td class="board-cell" v-for="(cell, ck) in row" :key="k + '-' + ck" @click="makeMove(ck, k)">
        <board-cell :sign="cell" />
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BoardCell from './BoardCell.vue';

export default defineComponent({
  name: 'Board',
  props: {
    board: {
      type: Array,
      required: true,
    },
  },
  components: {
    BoardCell,
  },
  emits: ['makeMove'],

  setup(props, { emit }) {
    const makeMove = (x: number, y: number) => {
      emit('makeMove', { x, y });
    };

    return { makeMove };
  },
});
</script>
<style scoped>
.board {
  width: 300px;
  height: 300px;
  margin: auto;
}
.board-cell {
  height: 33%;
  width: 33%;
  padding: 0px;
  margin: 0px;
  font-size: 50px;
}
td {
  border: 1px solid black;
}
</style>
