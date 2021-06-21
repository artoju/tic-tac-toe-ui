import { ref, computed } from 'vue';
import mitt from 'mitt';

const emitter = mitt();

/** Toast list object */
interface IToast {
  text: string;
  type: string;
  id: number;
}

/**
 * Toast event object.
 * @typedef {Object} ToastEvent - Event defining object.
 * @param {string} ToastEvent.type - Toast type defines background color (error/warning/success).
 * @param {string} ToastEvent.text - Toast display text.
 * @param {number} [ToastEvent.duration=5000] - Toast duration in milliseconds default 5000.
 */
type ToastEvent = { text: string; type: string; duration?: number };

// Active toast list
const toasts = ref<IToast[]>([]);

// Listen to toast event
emitter.on('toast', (e) => {
  const id = Math.floor(Math.random() * 100);
  toasts.value.push({ text: e.text, type: e.type, id });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t: IToast) => t.id !== id);
  }, e.duration || 5000);
});

/**
 * Emit toast event
 * @param {ToastEvent} ToastEvent
 */
const toast = ({ text, type, duration }: ToastEvent) => {
  emitter.emit('toast', { text, type, duration });
};

export { toasts, toast, ToastEvent };
