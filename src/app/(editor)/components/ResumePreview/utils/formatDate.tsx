export const formatDate = (isFullDate: boolean, v: string) =>
  isFullDate
    ? new Intl.DateTimeFormat("ru-RU").format(new Date(v))
    : new Intl.DateTimeFormat("ru-RU", { year: "numeric" }).format(new Date(v));
