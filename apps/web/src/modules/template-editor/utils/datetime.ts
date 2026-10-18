const pad = (value: number) => String(value).padStart(2, "0");

export function epochToLocalInputValue(epochMs: number): string {
  const date = new Date(epochMs);
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  return `${day}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function localInputValueToEpoch(inputValue: string): number | undefined {
  if (!inputValue) return undefined;
  const time = new Date(inputValue).getTime();
  return Number.isNaN(time) ? undefined : time;
}
