// sidebarLinks.js
import {
    Album,
    BarChart3,
    Book,
    BookOpenCheck,
    BookText,
    Building2,
    Heart,
    House,
    SquareLibrary,
  } from "lucide-react";
  
  export const sidebarLinks = [
    {
      title: "nav.statistics",
      icon: BarChart3,
      href: "/statistics",
    },
    {
      title: "nav.home",
      icon: House,
      href: "/home",
    },
    {
      title: "nav.allBooks",
      icon: BookText,
      href: "/books",
    },
    // {
    //   title: "หนังสือยอดนิยม",
    //   icon: BookCheck,
    //   href: "/books/popular-books",
    // },
    {
      title: "nav.newBooks",
      icon: Book,
      href: "/books/new-books",
    },
    {
      title: "nav.categories",
      icon: SquareLibrary,
      href: "/books/categories-books",
    },
    {
      title: "nav.departmentBooks",
      icon: Building2,
      href: "/books/departments",
    },
    {
      title: "nav.reservations",
      icon: BookOpenCheck,
      href: "/books/reservations",
    },
    {
      title: "nav.myBooks",
      icon: Album,
      href: "/books/my-books",
    },
    {
      title: "nav.favorites",
      icon: Heart,
      href: "/books/favorite-books",
    },    
    // {
    //   title: "คู่มือใช้งาน",
    //   icon: File,
    //   href: "/books/sdlc.pdf",
    // },
    // {
    //   title: "ประวัติการรยืมคืน",
    //   icon: History,
    //   href: "/books/history", 
    // },
  
    // {
    //   title: "ติดต่อเรา",
    //   icon: MessageSquareText,
    //   href: "/contact-us",
    // },
  ];
