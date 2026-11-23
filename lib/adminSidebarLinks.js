// sidebarLinks.js
import {
  Album,
  AppWindow,
  Banknote,
  Book,
  BookCheck,
  BookText,
  Building2,
  ChartColumnIncreasing,
  ChartNoAxesColumn,
  ChartPie,
  Heart,
  History,
  House,
  LayoutList,
  MessageSquareText,
  SquareLibrary,
  User,
  UserCog,
  QrCode,
  PackageCheck,
} from "lucide-react";

export const adminSidebarLinks = [
  {
    title: "admin.dashboard",
    icon: ChartPie ,
    href: "/dashboard",
  },
  {
    title: "admin.bookData",
    icon: BookText,
    href: "/dashboard/books",
  },
  {
    title: "admin.departmentBooks",
    icon: Building2,
    href: "/dashboard/department-books",
  },
  {
    title: "admin.categoryData",
    icon: LayoutList ,
    href: "/dashboard/categories",
  },
  {
    title: "admin.userData",
    icon: User ,
    href: "/dashboard/users",
  },
  {
    title: "admin.adminData",
    icon: UserCog  ,
    href: "/dashboard/admins",
  },
  {
    title: "admin.reservations",
    icon: BookCheck,
    href: "/dashboard/reservations",
 },
  {
    title: "admin.borrowReturn",
    icon: History,
    href: "/dashboard/history",
  },
  {
    title: "admin.orders",
    icon: Banknote,
    href: "/dashboard/orders",
  },
  {
    title: "admin.receipts",
    icon: PackageCheck,
    href: "/dashboard/receipts",
  },
  // {
  //   title: "เกณท์และค่าปรับ",
  //   icon: Banknote ,
  //   href: "/dashboard/criteria-fines",
  // },
  // {
  //   title: "รายงานและสถิติ",
  //   icon: ChartColumnIncreasing,
  //   href: "/dashboard/reports-statistics",
  // },
  {
    title: "admin.bannerSettings",
    icon: AppWindow,
    href: "/dashboard/banners",
  },
  {
    title: "admin.qrCode",
    icon: QrCode,
    href: "/dashboard/share-qr",
  },
];
