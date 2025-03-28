import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import OrderTracking from "@/pages/OrderTracking";
import ProductDetail from "@/pages/ProductDetail";
import Products from "@/pages/Products";
import Register from "@/pages/Register";
import SkinTest from "@/pages/SkinTest";
import { Route } from "@/types/common";

export const publicRoutes: Route[] = [
  {
    path: "/trang-chu",
    component: <Home />,
    name: "Trang chủ",
    hidden: false,
  },
  {
    path: "/gioi-thieu",
    component: <About />,
    name: "Giới thiệu",
    hidden: false,
  },
  {
    path: "/phan-tich-da",
    component: <SkinTest />,
    name: "Phân tích da",
    hidden: false,
  },
  {
    path: "/san-pham",
    component: <Products />,
    name: "Sản phẩm",
    hidden: false,
  },
  {
    path: "/san-pham/:id",
    component: <ProductDetail />,
    name: "Chi tiết sản phẩm",
    hidden: true,
  },
  {
    path: "/blog",
    component: <Blog />,
    name: "Blog",
    hidden: false,
  },
  {
    path: "/blog/:id",
    component: <BlogDetail />,
    name: "Chi tiết Blog",
    hidden: true,
  },
  {
    path: "/dang-nhap",
    component: <Login />,
    hidden: true,
  },
  {
    path: "/dang-ky",
    component: <Register />,
    hidden: true,
  },
  {
    path: "/gio-hang",
    component: <Cart />,
    hidden: true,
  },
  {
    path: "/theo-doi-don-hang",
    component: <OrderTracking />,
    hidden: true,
  },
];
