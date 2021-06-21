<template>
  <ul class="player-list">
    <li class="player-list__item" v-for="(p, key) in players" :key="key">{{ p.name ? p.name : p.id }}</li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PlayerList',
  props: {
    players: {
      type: Array,
      required: true,
    },
  },
});
</script>

<style>
.player-list {
  margin: 0;
  float: right;
  border: 1px solid black;
  border-top: none;
  border-radius: 0 0 5px 0;
  height: 100%;
  padding: 15px;
  width: 100%;
  box-sizing: border-box;
}
.player-list__item {
  list-style: none;
  padding: 0;
}
</style>
