import { ref } from 'vue';

export default function useBoard() {
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

  return {
    board,
    setBoard,
  };
}
