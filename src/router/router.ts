import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'StartScreen',
    component: () => import('@/views/StartScreen.vue'),
  },
  {
    path: '/lobby',
    name: 'MainLobby',
    component: () => import('@/views/MainLobby.vue'),
  },
  {
    path: '/game/multi/:id',
    name: 'Multiplayer',
    component: () => import('@/views/Multiplayer.vue'),
  },
  {
    path: '/games',
    name: 'GameList',
    component: () => import('@/views/GameList.vue'),
  },
  {
    path: '/game/single/:id',
    name: 'SinglePlayer',
    component: () => import('@/views/SinglePlayer.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '',
    component: () => import('@/views/404.vue'),
    beforeEnter: (to: any, from: any, next: any) => {
      next({ name: 'not-found' });
    },
  },
  {
    path: '/404',
    name: 'not-found',
    component: () => import('@/views/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
