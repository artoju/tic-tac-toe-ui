import { ref, computed } from 'vue';
import mitt from 'mitt';

const emitter = mitt();

const isOpen = ref(false);

const type = ref('');

const input = ref('');

const text = ref('');

const callback = ref<Function>(() => true);
const close = () => {
  isOpen.value = false;
  type.value = '';
  input.value = '';
  text.value = '';
  callback.value = () => true;
};

const confirm = () => {
  if (type.value === 'input') {
    callback.value({ confirm: true, input: input.value });
  } else {
    callback.value({ confirm: true });
  }
  close();
};

const cancel = () => {
  callback.value({ confirm: false });
  close();
};

/**
 * Toast event object.
 * @typedef {Object} ModalEvent - Event defining object.
 * @param {string} ModalEvent.type - Toast type defines background color (input/confirm/notification).
 * @param {string} ModalEvent.text - Toast display text.
 * @param {Function} ModalEvent.callback - Toast duration in milliseconds default 5000.
 */
type ModalEvent = { text: string; type: string; callback: (event: { confirm: boolean; input?: string }) => void };

// Active toast list

// Listen to toast event
emitter.on('openModal', (e) => {
  isOpen.value = true;
  type.value = e.type;
  input.value = '';
  text.value = e.text;
  callback.value = e.callback;
});

/**
 * Emit toast event
 * @param {ModalEvent} ModalEvent
 */
const openModal = (event: ModalEvent) => {
  emitter.emit('openModal', event);
};

export { input, isOpen, type, text, openModal, confirm, cancel, ModalEvent };
