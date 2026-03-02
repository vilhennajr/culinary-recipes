import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { public: true },
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/auth/RegisterView.vue"),
    meta: { public: true },
  },
  {
    path: "/",
    component: () => import("@/components/templates/AppLayout.vue"),
    children: [
      {
        path: "",
        redirect: "/recipes",
      },
      {
        path: "recipes",
        name: "recipes",
        component: () => import("@/views/recipes/RecipesView.vue"),
      },
      {
        path: "categories",
        name: "categories",
        component: () => import("@/views/categories/CategoriesView.vue"),
      },
      {
        path: "users",
        name: "users",
        component: () => import("@/views/users/UsersView.vue"),
      },
    ],
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  // Use the Pinia store as single source of truth for auth state.
  // Pinia stores are initialised at app boot (main.ts) before the router runs,
  // so useAuthStore() is safe to call here.
  const auth = useAuthStore();
  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: "login" };
  }
  if (to.meta.public && auth.isAuthenticated) {
    return { name: "recipes" };
  }
});

export default router;
