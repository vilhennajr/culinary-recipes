import axios from "axios";

export function extractApiError(err: unknown, fallback = "Ocorreu um erro inesperado"): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data?.message === "string") return data.message;
    if (Array.isArray(data?.message)) return data.message[0];
    if (typeof data?.error === "string") return data.error;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
