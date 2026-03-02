import { reactive } from "vue";

type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration: number;
}

// These refs are intentionally module-level (singleton) so that all consumers
// share the same toast queue — a standard pattern for global notification systems.
// Do NOT move them inside the useToast() function body.
const toasts = reactive<Toast[]>([]);
let _nextId = 1;

export function useToast() {
  function add(message: string, type: ToastType = "info", duration = 4000): void {
    const id = _nextId++;
    toasts.push({ id, type, message, duration });
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
  }

  function dismiss(id: number): void {
    const idx = toasts.findIndex((t) => t.id === id);
    if (idx !== -1) toasts.splice(idx, 1);
  }

  return {
    toasts,
    dismiss,
    success: (msg: string, duration?: number) => add(msg, "success", duration),
    error: (msg: string, duration?: number) => add(msg, "error", duration),
    warning: (msg: string, duration?: number) => add(msg, "warning", duration),
    info: (msg: string, duration?: number) => add(msg, "info", duration),
  };
}
