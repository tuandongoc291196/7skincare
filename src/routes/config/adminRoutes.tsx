import ManageAccounts from "@/pages/ManageAccounts";
import ManageQuestions from "@/pages/ManageQuestions";
import Report from "@/pages/Report";
import { Route } from "@/types/common";

export const adminRoutes: Route[] = [
  {
    path: "/bao-cao",
    component: <Report />,
    name: "Báo cáo",
    hidden: false,
  },
  {
    path: "/quan-ly-tai-khoan",
    component: <ManageAccounts />,
    name: "Quản lý tài khoản",
    hidden: false,
  },
  {
    path: "/quan-ly-cau-hoi",
    component: <ManageQuestions />,
    name: "Quản lý câu hỏi",
    hidden: false,
  },
];
