import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/browse",
      name: "browse",
      component: () => import("../views/BrowseView.vue"),
    },
    {
      path: "/levels",
      name: "levels",
      component: () => import("../views/LevelsView.vue"),
    },
  ],
});

export default router;
