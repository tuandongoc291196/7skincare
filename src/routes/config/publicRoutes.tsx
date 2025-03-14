import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Cart from "@/pages/Cart";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import OrderTracking from "@/pages/OrderTracking";
import Products from "@/pages/Products";
import Register from "@/pages/Register";
import { Route } from "@/types/common";

export const publicRoutes: Route[] = [
  {
    path: "/",
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
    path: "/blog",
    component: <Blog />,
    name: "Blog",
    hidden: false,
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
