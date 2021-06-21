<template>
  <h1 :style="headerStyle">
    <span class="text--blue">TIC</span> <span class="text--black">TAC</span> <span class="text--red">TOE</span>
  </h1>
  <h2 class="sub-header">{{ subHeader }}</h2>
  <div class="container">
    <router-view />
  </div>
  <toast-messages />
  <modal />
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const route = useRoute();
    const startScreenHeaderFontSize = '60px';
    const headerStyle = reactive({ fontSize: startScreenHeaderFontSize });

    watch(
      () => route.name,
      () => {
        if (route.name === 'StartScreen') {
          headerStyle.fontSize = startScreenHeaderFontSize;
        } else {
          headerStyle.fontSize = '20px';
        }
      }
    );

    const subHeader = computed(() => {
      return route.path.split('/')[1].toUpperCase();
    });
    return {
      headerStyle,
      route,
      subHeader,
    };
  },
});
</script>
<style lang="scss">
.sub-header {
  font-size: 40px;
}
</style>
