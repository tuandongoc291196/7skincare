import ManageAccounts from "@/pages/ManageAccounts";
import ManagePositions from "@/pages/ManagePositions";
import { Route } from "@/types/common";

export const adminRoutes: Route[] = [
  {
    path: "/quan-ly-tai-khoan",
    component: <ManageAccounts />,
    name: "Quản lý tài khoản",
    hidden: false,
  },
  {
    path: "/quan-ly-vi-tri",
    component: <ManagePositions />,
    name: "Quản lý vị trí",
    hidden: false,
  },
];
