import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { isStaffRole } from "@/lib/userRoles";

function redirectTo(request, destination) {
  return NextResponse.redirect(new URL(destination, request.url));
}

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  const token = await getToken({ req: request });

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/api/admin/")) {
    if (pathname.match(/^\/api\/admin\/users\/[^/]+\/role\/?$/) && token.role !== "ADMIN") {
      return NextResponse.json(
        { message: "เฉพาะผู้ดูแลระบบเท่านั้นที่จัดการสิทธิ์ได้" },
        { status: 403 }
      );
    }

    if (!isStaffRole(token.role)) {
      return NextResponse.json(
        { message: "ไม่มีสิทธิ์เข้าถึงส่วนผู้ดูแลระบบ" },
        { status: 403 }
      );
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard/") || pathname === "/dashboard") {
    if (!isStaffRole(token.role)) {
      return redirectTo(request, "/home");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/api/admin/:path*",
  ],
};
