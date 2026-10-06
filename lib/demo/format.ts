export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function shortHash(value: string): string {
  return value.length > 18 ? `${value.slice(0, 10)}…${value.slice(-6)}` : value;
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}