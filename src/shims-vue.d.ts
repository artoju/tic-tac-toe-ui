declare module '*.vue' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    router?: VueRouter;
    beforeRouteEnter?: NavigationGuard;
    beforeRouteLeave?: NavigationGuard;
    beforeRouteUpdate?: NavigationGuard;
  }
}
