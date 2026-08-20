"use client";
import React, { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";

export default function ShareQrPage() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  useEffect(() => {
    // Get the current origin (e.g. https://library.com)
    setWebsiteUrl(window.location.origin);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8">
      <div className="bg-card shadow-xl rounded-2xl p-10 max-w-sm w-full text-center flex flex-col items-center border">
        <h1 className="text-2xl font-bold mb-2">QR Code ห้องสมุด</h1>
        <p className="text-muted-foreground text-sm mb-8">
          สแกนเพื่อเข้าสู่เว็บไซต์ระบบจัดการห้องสมุด
        </p>

        {websiteUrl && (
          <div className="bg-white p-4 rounded-xl shadow-sm mb-8 print-qr-container">
            <QRCodeSVG
              value={websiteUrl}
              size={200}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"H"}
              includeMargin={false}
            />
          </div>
        )}

        <Button onClick={handlePrint} className="w-full">
          พิมพ์ QR Code
        </Button>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-qr-container, .print-qr-container * {
            visibility: visible;
          }
          .print-qr-container {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(2);
          }
        }
      `}</style>
    </div>
  );
}
