<template>
  <div>
    <div v-if="isOpen" class="modal-background">
      <div>
        <div class="modal-content">
          <p>{{ text }}</p>
          <input class="nes-input" v-if="type === 'input'" v-model="input" />
          <button type="button" class="nes-btn" @click="confirm">OK</button>
          <button type="button" class="nes-btn" @click="cancel">cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { input, isOpen, type, text, confirm, cancel } from './ModalEvent';

export default defineComponent({
  name: 'Modal',
  setup() {
    return { input, isOpen, type, text, confirm, cancel };
  },
});
</script>

<style lang="scss" scoped>
.modal-background {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.modal-content {
  margin: 20% auto;
  background: white;
  max-width: 320px;
}
</style>
