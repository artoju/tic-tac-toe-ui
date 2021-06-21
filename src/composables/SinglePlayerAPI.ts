import axios from 'axios';
import { ref, computed, reactive } from 'vue';

const API = process.env.VUE_APP_API_URL;

type Game = {
  ID: string;
  Board: string;
  Status: string;
  NextPlayer: string;
};

type StartGameresponse = {
  ID: string;
  token: string;
};

const interceptor = ref(-1);
const token = ref('');

const state = reactive({
  interceptor,
  token,
});

const setInterceptor = (newInterceptor: number) => {
  state.interceptor = newInterceptor;
};

/**
 * @param {string} newToken Token to be added.
 *
 * Add new interceptor for new authorization token. Removes old interceptor.
 */
const setToken = (newToken: string) => {
  state.token = newToken;

  // Remove old interceptor if exists with interceptor id
  if (state.interceptor > -1) {
    axios.interceptors.request.eject(state.interceptor);
  }

  // Get new interceptor id
  const interceptorId = axios.interceptors.request.use(
    (config) => {
      return { ...config, ...{ headers: { Authorization: `Bearer ${state.token}` } } };
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Save interceptor id
  setInterceptor(interceptorId);
};

const startGame = (): Promise<StartGameresponse> => {
  return new Promise((resolve, reject) => {
    axios
      .post<StartGameresponse>(`${API}/games`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: ErrorEvent) => {
        reject(error);
      });
  });
};

const listGames = (): Promise<Game[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get<Game[]>(`${API}/games`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: ErrorEvent) => {
        reject(error);
      });
  });
};

const getGame = (id: string): Promise<Game> => {
  return new Promise((resolve, reject) => {
    axios
      .get<Game>(`${API}/games/${id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: ErrorEvent) => {
        reject(error);
      });
  });
};

const updateGame = (request: Game): Promise<Game> => {
  return new Promise((resolve, reject) => {
    axios
      .put<Game>(`${API}/games/${request.ID}`, request)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error: ErrorEvent) => {
        reject(error);
      });
  });
};

const deleteGame = (id: string): Promise<Object> => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${API}/games/${id}`)
      .then((response: Object) => {
        resolve(response);
      })
      .catch((error: ErrorEvent) => {
        reject(error);
      });
  });
};

export { startGame, listGames, getGame, updateGame, deleteGame, setToken };
