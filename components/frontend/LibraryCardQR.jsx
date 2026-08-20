import React from "react";
import { QRCodeSVG } from "qrcode.react";

export default function LibraryCardQR({ userProfile }) {
  if (!userProfile) return null;

  // ใช้รหัสนักศึกษา (codeNumber) หรือถ้าไม่มีให้ใช้ userId แทน
  const qrValue = userProfile.codeNumber || userProfile.userId || "";

  if (!qrValue) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-card shadow-md rounded-2xl p-6 border text-center">
      <h3 className="font-bold text-lg mb-1">บัตรห้องสมุดดิจิทัล</h3>
      <p className="text-xs text-muted-foreground mb-4">แสดง QR Code นี้เพื่อทำการยืม-คืน</p>
      
      <div className="bg-white p-3 rounded-lg shadow-inner inline-block">
        <QRCodeSVG 
          value={qrValue} 
          size={140} 
          bgColor="#ffffff" 
          fgColor="#000000" 
          level="H" 
        />
      </div>
      
      <div className="mt-3 font-mono text-sm tracking-widest bg-muted px-3 py-1 rounded">
        {qrValue}
      </div>
    </div>
  );
}
