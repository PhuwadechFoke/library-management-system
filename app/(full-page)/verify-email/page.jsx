"use client";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import LocalizedText from "@/components/frontend/LocalizedText";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("กำลังยืนยันบัญชี...");
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const loginHref = userId
    ? `/login?callbackUrl=${encodeURIComponent(`/onboarding/${userId}`)}`
    : "/login";

  useEffect(() => {
    let cancelled = false;

    const verifyEmail = async () => {
      if (!token) {
        if (!cancelled) {
          setStatus("idle");
          setMessage("ไม่มีโทเค็นยืนยันบัญชีในลิงก์นี้ กรุณาตรวจสอบอีเมลอีกครั้งหรือสมัครใหม่");
        }
        return;
      }

      try {
        const response = await fetch(`/api/users/verify-email?token=${token}`);
        const result = await response.json();

        if (cancelled) return; // ถ้า component ถูก unmount หรือ effect ถูกยกเลิกไปแล้ว ไม่ต้อง set state ซ้ำ

        if (!response.ok) {
          throw new Error(result.message || "ยืนยันบัญชีไม่สำเร็จ");
        }

        setStatus("success");
        setMessage(
          result.userId
            ? "ยืนยันบัญชีสำเร็จ เข้าสู่ระบบเพื่อกรอกข้อมูลส่วนตัวให้ครบถ้วน"
            : result.message || "ยืนยันบัญชีสำเร็จ"
        );
        toast.success("ยืนยันบัญชีสำเร็จ");

        if (result.userId) {
          setUserId(result.userId);
          setTimeout(() => {
            router.replace(
              `/login?callbackUrl=${encodeURIComponent(
                `/onboarding/${result.userId}`
              )}`
            );
          }, 1500);
        }
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(error.message || "ยืนยันบัญชีไม่สำเร็จ");
        toast.error(error.message || "ยืนยันบัญชีไม่สำเร็จ");
      }
    };

    verifyEmail();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="max-w-2xl mx-auto min-h-screen px-8 mt-36">
      <div
        id="alert-additional-content-2"
        className="p-4 mb-4 border rounded-lg bg-card"
        role="alert"
      >
        <div className="flex items-center">
          <Info className="flex-shrink-0 w-4 h-4 me-2" />
          <span className="sr-only">Info</span>
          <h3 className="text-lg font-medium">
            <LocalizedText value={status === "success" ? "ยืนยันอีเมลสำเร็จ" : "ยืนยันอีเมล"} />
          </h3>
        </div>
        <div className="mt-2 mb-4 text-sm text-muted-foreground">{message}</div>
        <div className="mt-4 flex justify-end">
          <Link href={loginHref}>
            <Button className="text-sm font-bold" size="sm">
              <LocalizedText value={status === "success" ? "เข้าสู่ระบบ" : "กลับไปหน้าเข้าสู่ระบบ"} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}