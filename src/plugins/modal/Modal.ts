import Vue, { App, InjectionKey } from 'vue';
import Modal from './Modal.vue';
import { openModal, ModalEvent } from './ModalEvent';

type ModalFn = (event: {
  text: string;
  type: string;
  callback: (event: { confirm: boolean; input?: string }) => void;
}) => void;

const ModalKey: InjectionKey<ModalFn> = Symbol('Modal');

/** Plugin for displaying toast messages */
const ModalPlugin = {
  install: (app: App, options?: any) => {
    app.config.globalProperties.$modal = (event: ModalEvent) => {
      openModal(event);
    };
    // Allow injection scheme inside setup
    app.provide(ModalKey, openModal);

    // Global component
    app.component('Modal', Modal);
  },
};

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    /**
     * Displays toast message.
     * @param {ModalEvent} ModalEvent - Event defining object.
     * @param {string} ModalEvent.type - Toast type defines background color (error/warning/success).
     * @param {string} ModalEvent.text - Toast display text.
     * @param {Function} ModalEvent.callback - Toast duration in milliseconds default 5000.
     */
    $modal(e: ModalEvent): void;
  }
}

export { ModalPlugin, ModalKey };
