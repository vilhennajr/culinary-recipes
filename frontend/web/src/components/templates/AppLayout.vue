<script setup lang="ts">
import { ref } from "vue";
import AppHeader from "@/components/organisms/AppHeader.vue";
import AppSidebar from "@/components/organisms/AppSidebar.vue";
import ToastContainer from "@/components/organisms/ToastContainer.vue";

const sidebarOpen = ref(false);
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <div class="flex flex-1 overflow-hidden">
      <Transition
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 z-20 bg-black/40 md:hidden transition-opacity duration-200"
          @click="sidebarOpen = false"
        />
      </Transition>
      <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <main class="flex-1 overflow-y-auto p-4 sm:p-6">
        <RouterView />
      </main>
    </div>
    <ToastContainer />
  </div>
</template>
