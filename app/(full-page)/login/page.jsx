"use client";
import LoginForm from "@/components/frontend/LoginForm";
import Image from "next/image";
import LocalizedText from "@/components/frontend/LocalizedText";
export default function Login() {
  return (
    <div className="flex min-h-[calc(100dvh-4.5rem)] w-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="auth-shell w-full max-w-5xl overflow-hidden rounded-3xl border border-white/60 bg-card/80 shadow-2xl shadow-red-950/10 backdrop-blur-xl dark:border-white/10">
        <div className="grid min-h-[min(680px,calc(100dvh-8rem))] sm:grid-cols-2">
          <div className="auth-visual relative hidden overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-orange-800 sm:flex sm:items-center sm:justify-center">
            <div className="auth-orb auth-orb-one" />
            <div className="auth-orb auth-orb-two" />
            <div className="relative z-10 flex h-full w-full flex-col items-center justify-center p-8">
              <Image
                src="/Bibliophile-amico.png"
                className="auth-float w-full max-w-md object-contain drop-shadow-2xl"
                priority
                width={600}
                height={600}
                alt="Bibliophile-amico"
              />
              <div className="mt-2 h-1 w-20 rounded-full bg-white/40" />
            </div>
          </div>
          <div className="flex items-center justify-center bg-card/70 px-6 py-10 sm:px-9 sm:py-12">
            <div className="auth-content w-full max-w-md">
              <div className="mb-8 text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-800/10 bg-red-50 px-3 py-1 text-xs font-semibold tracking-wide text-red-800 dark:border-red-300/10 dark:bg-red-950/40 dark:text-red-200">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
                  LMS · UDVC
                </span>
                <h1 className="text-xl font-bold leading-tight tracking-tight sm:text-2xl">
                    <LocalizedText value="auth.loginTitle" />
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  วิทยาลัยอาชีวศึกษาอุดรธานี
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ใช้ layout ใหม่
