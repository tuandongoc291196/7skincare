export const Statuses = {
  ACTIVATED: "ACTIVATED",
  DISABLED: "DISABLED",
} as const;

export const Roles = {
  STAFF: "STAFF",
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export const OrderStatuses = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SUCCESS: "SUCCESS",
  CANCELED: "CANCELED",
  DONE: "DONE",
} as const;

export type OrderStatus = (typeof OrderStatuses)[keyof typeof OrderStatuses];
export type Status = (typeof Statuses)[keyof typeof Statuses];
export type Role = (typeof Roles)[keyof typeof Roles];
