import ManageAccounts from "@/pages/ManageAccounts";
import { Route } from "@/types/common";

export const adminRoutes: Route[] = [
  {
    path: "/quan-ly-tai-khoan",
    component: <ManageAccounts />,
    name: "Quản lý tài khoản",
    hidden: false,
  },
];
