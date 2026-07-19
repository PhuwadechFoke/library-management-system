import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import db from "./db";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("ไม่มีอีเมลหรือรหัสผ่าน");
          }
          const existingUser = await db.user.findUnique({
            where: { email: credentials.email },
          });
          if (!existingUser) {
            console.error("ไม่พบบัญชีผู้ใช้");
            throw new Error("ไม่พบบัญชีผู้ใช้");
          }
          console.log("Passed Check 2");

          const passwordMatch = await compare(
            credentials.password,
            existingUser.password
          );
          if (!passwordMatch) {
            console.log("รหัสผ่านไม่ถูกต้อง");
            throw new Error("รหัสผ่านไม่ถูกต้อง");
          }
          console.log("Pass 3 Checked");

          // เช็คว่ายืนยันอีเมลแล้วหรือยัง
          if (!existingUser.emailVerified) {
            console.log("อีเมลนี้ยังไม่ได้ยืนยัน");
            throw new Error("อีเมลนี้ยังไม่ได้ยืนยัน กรุณาตรวจสอบกล่องอีเมลของคุณ");
          }

          const user = {
            id: existingUser.id,
            username: existingUser.username,
            email: existingUser.email,
            role: existingUser.role,
            emailVerified: existingUser.emailVerified,
          };
          console.log("User Compiled");
          return user;
        } catch (error) {
          console.error("Authorization failed:", error);
          throw new Error(error.message || "เกิดข้อผิดพลาดในการตรวจสอบ");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
  },
};