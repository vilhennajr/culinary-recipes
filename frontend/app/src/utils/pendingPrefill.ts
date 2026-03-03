interface Prefill {
  login: string;
  password: string;
}

let pending: Prefill | null = null;

export function setPendingPrefill(login: string, password: string): void {
  pending = { login, password };
}

export function consumePendingPrefill(): Prefill | null {
  const val = pending;
  pending = null;
  return val;
}
