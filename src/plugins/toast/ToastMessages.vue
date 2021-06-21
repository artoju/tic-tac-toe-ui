<template>
  <div class="toast-container">
    <transition-group name="slide-fade">
      <div v-for="t in toasts" :class="'toast ' + t.type" :key="t.id">
        <p class="toast__text">{{ t.text }}</p>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { toasts } from './ToastEvent';

export default defineComponent({
  name: 'ToastMessages',
  setup() {
    return { toasts };
  },
});
</script>

<style lang="scss" scoped>
.toast-container {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 220px;
  display: flex;
  flex-direction: column;
}
.toast {
  margin: 10px;
  height: 50px;
  width: 200px;
  border-radius: 5px;
  list-style: none;
  transition: all 0.5s ease;
  &.error {
    background-color: rgb(236, 86, 86);
  }
  &.success {
    background-color: rgb(116, 201, 116);
  }
  &.warning {
    background-color: rgb(226, 165, 85);
  }
}
.toast__text {
  color: #ffff;
  text-align: left;
  padding: 5px;
  margin: 0;
}
.slide-fade-enter-active {
  transition: all 0.5s ease;
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-enter-to {
  opacity: 1;
  transform: translateY(0px);
}
</style>
