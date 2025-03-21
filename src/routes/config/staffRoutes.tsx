import ManageBlogs from "@/pages/ManageBlogs";
import ManageBrands from "@/pages/ManageBrands";
import ManageCategories from "@/pages/ManageCategories";
import ManageOrders from "@/pages/ManageOrders";
import ManageProducts from "@/pages/ManageProducts";
import ManageQuestions from "@/pages/ManageQuestions";
import { Route } from "@/types/common";

export const staffRoutes: Route[] = [
  {
    path: "/quan-ly-don-hang",
    component: <ManageOrders />,
    name: "Đơn hàng",
    hidden: false,
  },
  {
    path: "/quan-ly-san-pham",
    component: <ManageProducts />,
    name: "Sản phẩm",
    hidden: false,
  },
  {
    path: "/quan-ly-danh-muc",
    component: <ManageCategories />,
    name: "Danh mục",
    hidden: false,
  },
  {
    path: "/quan-ly-thuong-hieu",
    component: <ManageBrands />,
    name: "Thương hiệu",
    hidden: false,
  },
  {
    path: "/quan-ly-cau-hoi",
    component: <ManageQuestions />,
    name: "Câu hỏi",
    hidden: false,
  },
  {
    path: "/quan-ly-blog",
    component: <ManageBlogs />,
    name: "Blog",
    hidden: false,
  },
];
