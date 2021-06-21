import { ref, computed, reactive, inject } from 'vue';
import { Logger } from '@/types/Types';

type MessageListener = (event: MessageEvent) => any;
const messageListeners = ref<MessageListener[]>([]);
const connection = reactive<{ socket: WebSocket | undefined }>({ socket: undefined });
const state = ref('CLOSED');

function setState(newState: string) {
  state.value = newState;
}

const setConnection = (url: string) => {
  const logger = inject('vuejs3-logger') as Logger;

  logger.debug(connection.socket);
  logger.debug(state.value);

  connection.socket = new WebSocket(url);

  // Reset listeners
  messageListeners.value = [];

  // Loop listeners on message
  connection.socket.onmessage = (e: MessageEvent) => {
    messageListeners.value.forEach((ml) => {
      ml(e);
    });
  };

  connection.socket.onopen = (e: Event) => {
    logger.debug('connected', e);
    setState('OPEN');
  };

  connection.socket.onclose = (event: CloseEvent) => {
    if (event.wasClean) {
      logger.debug(`Connection closed cleanly, code: ${event.code} reason: ${event.reason}`);
    } else {
      logger.debug(`Connection died code: ${event.code}`);
    }
  };

  connection.socket.onerror = (error: Event) => {
    logger.debug(error);
    logger.debug(`Socket error: ${error}`);
  };
};

const closeConnection = () => {
  if (connection.socket) {
    connection.socket.close();
    connection.socket = undefined;
    setState('CLOSED');
  }
};

const sendMessage = (msg: string) => {
  if (connection.socket) {
    connection.socket.send(msg);
  }
};

const addMessageListener = (newListener: (event: MessageEvent) => any) => {
  messageListeners.value.push(newListener);
};

export { connection, state, setConnection, addMessageListener, closeConnection, sendMessage };
