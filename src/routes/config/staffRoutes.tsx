import ManageBrands from "@/pages/ManageBrands";
import ManageCategories from "@/pages/ManageCategories";
import ManageProducts from "@/pages/ManageProducts";
import { Route } from "@/types/common";

export const staffRoutes: Route[] = [
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
];
