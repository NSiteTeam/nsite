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
      path: "/logout",
      name: "logout",
      component: () => import("../views/LogoutView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/browse/:level?",
      name: "browse",
      component: () => import("../views/BrowseView.vue"),
    },
    {
      path: "/repository/:content/:id",
      name: "repository",
      component: () => import("../views/RepositoryView.vue"),
    },
    {
      path: "/admin/users",
      name: "users",
      component: () => import("../views/admin/UsersView.vue")
    },
    {
      path: "/admin/news",
      name: "users",
      component: () => import("../views/admin/ManageNewsView.vue")
    },
    {
      path: "/timeline",
      name: "timeline",
      component: () => import("../views/TimelineView.vue")
    },
    {
      path: "/profile",
      name: "account",
      component: () => import("../views/ProfileView.vue")
    },
    {
      path: "/dashboard/:popup?/:action?",
      name: "dashboard",
      component: () => import("../views/admin/Dashboard.vue")
    },
  ],
});

export default router;
