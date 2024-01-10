import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import LighthouseView from "../views/LightsOutGameView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "gameLightsOut",
    component: LighthouseView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
