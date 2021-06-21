import Vue, { App, InjectionKey } from 'vue';
import ToastMessages from './ToastMessages.vue';
import { toast, ToastEvent } from './ToastEvent';

type ToastFn = (event: { text: string; type: string; duration?: number }) => void;
const ToastKey: InjectionKey<ToastFn> = Symbol('Toast');

/** Plugin for displaying toast messages */
const ToastPlugin = {
  install: (app: App, options?: any) => {
    app.config.globalProperties.$toast = ({ text, type, duration }: ToastEvent) => {
      toast({ text, type, duration });
    };
    // Allow injection scheme inside setup
    app.provide(ToastKey, toast);

    // Global component
    app.component('toast-messages', ToastMessages);
  },
};
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Displays toast message.
     * @param {ToastEvent} ToastEvent - Event defining object.
     * @param {string} ToastEvent.type - Toast type defines background color (error/warning/success).
     * @param {string} ToastEvent.text - Toast display text.
     * @param {number} [ToastEvent.duration=5000] - Toast duration in milliseconds default 5000.
     */
    $toast(e: ToastEvent): void;
  }
}

export { ToastPlugin, ToastKey };
