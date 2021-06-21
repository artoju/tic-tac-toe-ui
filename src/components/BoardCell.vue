<template>
  <svg width="100" height="100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <circle
      v-if="sign == 'O'"
      cx="50"
      cy="50"
      r="40"
      stroke="crimson"
      fill="transparent"
      stroke-width="5"
      shape-rendering="crispEdges"
    />
    <template v-else-if="sign == 'X'">
      <line x1="10" x2="90" y1="90" y2="10" stroke="dodgerblue" stroke-width="5" shape-rendering="crispEdges" />
      <line x1="90" x2="10" y1="90" y2="10" stroke="dodgerblue" stroke-width="5" shape-rendering="crispEdges" />
    </template>
    <div v-else></div>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BoardCell',
  props: {
    sign: {
      type: String,
    },
  },
});
</script>
