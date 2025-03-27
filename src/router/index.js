// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthUserStore } from "../stores/auth_user";
import NotFound from "../components/NotFound.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../components/Home.vue"), // لود دینامیک برای بهینه‌سازی
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../components/Dashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/tasks/create",
    name: "tasks_create",
    component: () => import("../components/TaskForm.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("../components/Profile.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../components/Auth/Login.vue"),
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("../components/Auth/Register.vue"),
    meta: {
      requiresGuest: true,
    },
  },
  {
    path: "/:pathMatch(.*)*", // این روت همه مسیرهای نامعتبر رو می‌گیره
    name: "not_found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthUserStore();
  
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresGuest = to.matched.some((record) => record.meta.requiresGuest);

  if (requiresAuth && !authStore.checkUserIsSigned) {
    next({ name: "login" });
  } else {
    if (requiresGuest && authStore.checkUserIsSigned) {
      next({ name: "home" });
    }
    next();
  }
});
export default router;
