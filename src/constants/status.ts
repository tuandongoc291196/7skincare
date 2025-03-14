export const Statuses = {
  ACTIVATED: "ACTIVATED",
  DISABLED: "DISABLED",
} as const;

export type Status = (typeof Statuses)[keyof typeof Statuses];
