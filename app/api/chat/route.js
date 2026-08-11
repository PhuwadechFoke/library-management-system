import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const SYSTEM_PROMPT = `คุณคือผู้ช่วย AI ของระบบห้องสมุดออนไลน์ชื่อ "LibraryBot" มีบุคลิกเป็นมิตร กระตือรือร้น และเป็นประโยชน์

ข้อมูลระบบห้องสมุดที่คุณรู้:
- ค้นหาหนังสือ: ไปที่เมนู "หนังสือทั้งหมด" แล้วพิมพ์ชื่อหรือหมวดหมู่ในช่องค้นหา
- การยืมหนังสือ: ตรวจสอบจำนวนคงเหลือในหน้ารายละเอียดหนังสือ แล้วติดต่อเจ้าหน้าที่ห้องสมุด รายการยืมจะแสดงใน "หนังสือของฉัน"
- การจองหนังสือ: กดปุ่มจองในหน้ารายละเอียดหนังสือ หลังเจ้าหน้าที่อนุมัติจะได้รับอีเมลแจ้ง
- กำหนดคืน: ดูได้ที่เมนู "หนังสือของฉัน" ระบบส่งอีเมลเตือน 1 วันก่อนครบกำหนด และเตือนทุกวันหากเกินกำหนด
- ค่าปรับ: เจ้าหน้าที่ประเมินในขั้นตอนรับคืน ติดต่อห้องสมุดเพื่อรายละเอียด
- รายการโปรด: กดไอคอนหัวใจในหน้ารายละเอียดหนังสือ ดูได้จากเมนู "รายการโปรด"
- สถิติ: เปิดเมนู "สถิติห้องสมุด" เพื่อดูหนังสือยอดนิยมและรายการค้างคืน

กฎการตอบ:
- ตอบเป็นภาษาเดียวกับที่ผู้ใช้ถาม (ไทย = ตอบไทย, English = answer in English)
- ตอบกระชับ ชัดเจน ไม่ยาวเกินไป
- ถ้าถามเรื่องห้องสมุด ตอบข้อมูลระบบที่รู้
- ถ้าถามคำถามทั่วไป ตอบได้ตามปกติ เช่น คณิตศาสตร์ วิทยาศาสตร์ ประวัติศาสตร์ ฯลฯ
- ไม่ต้องแนะนำตัวซ้ำทุกข้อความ`;

/** ดึง retryDelay จาก Gemini error (วินาที) */
function getRetryDelay(error) {
  try {
    const details = error?.errorDetails ?? [];
    const retryInfo = details.find((d) => d["@type"]?.includes("RetryInfo"));
    if (retryInfo?.retryDelay) {
      const seconds = parseInt(retryInfo.retryDelay, 10);
      return isNaN(seconds) ? 30 : seconds;
    }
  } catch {}
  return 30;
}

export async function POST(request) {
  try {
    const { messages, userMessage } = await request.json();

    if (!userMessage?.trim()) {
      return NextResponse.json({ error: "กรุณาพิมพ์คำถาม" }, { status: 400 });
    }

    if (!genAI) {
      return NextResponse.json(
        { error: "ยังไม่ได้ตั้งค่า GEMINI_API_KEY — กรุณาเพิ่มใน Environment Variables" },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history (exclude welcome message)
    const history = (messages || [])
      .filter((m) => m.role !== "bot" || m.isWelcome !== true)
      .map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage.trim());
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error("Gemini API error:", error);

    // ตรวจจับ 429 Rate Limit — ส่งกลับทันที ไม่รอ retry ฝั่ง server
    // (เพราะ Vercel function timeout < เวลาที่ต้องรอ)
    const status = error?.status ?? error?.response?.status;
    if (status === 429) {
      const retryAfter = getRetryDelay(error);
      return NextResponse.json(
        { error: "RATE_LIMITED", retryAfter },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเชื่อมต่อ AI กรุณาลองใหม่อีกครั้ง" },
      { status: 500 }
    );
  }
}
