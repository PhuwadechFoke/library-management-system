"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import { Bold, Images, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import moment from "moment";
import "moment/locale/th";
import { FINE_RATE } from "@/lib/constants";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
moment.locale("th");

export default function Page({ params: { id } }) {
  const router = useRouter();
  const {
    data: borrow,
    isLoading: isBorrowLoading,
    error: borrowError,
  } = useQuery({
    queryKey: ["borrow", id],
    queryFn: () => getData(`admin/borrows/${id}`),
  });

  if (borrowError) return <div className="p-6"> Error: {borrowError.message}</div>;

  if (isBorrowLoading) {
    return (
      <div className="p-6">
        <Skeleton className="sm:flex items-center justify-between py-6 sm:py-8 px-6 sm:px-12 mb-2"></Skeleton>
        <Skeleton className="w-full h-96 mb-2" />
      </div>
    );
  }

  // --- คำนวณวันเกินกำหนด: ถ้าคืนแล้วใช้วันที่คืนจริง ถ้ายังไม่คืนใช้วันนี้ (คำนวณสด) ---
  let overdueDays = 0;
  if (borrow?.dueDate) {
    const dueTime = new Date(borrow.dueDate).setHours(0, 0, 0, 0);
    const compareTime =
      borrow?.isReturned && borrow?.returnDate
        ? new Date(borrow.returnDate).setHours(0, 0, 0, 0)
        : new Date().setHours(0, 0, 0, 0);

    if (compareTime > dueTime) {
      overdueDays = Math.round((compareTime - dueTime) / (1000 * 60 * 60 * 24));
    }
  }

  const currentFineRate = FINE_RATE?.DAY ?? 0;
  const fineAmount = borrow?.book?.price ? Math.round(borrow.book.price * currentFineRate) : 0;

  // ค่าปรับที่คำนวณสด (สำหรับตอนยังไม่คืน) เทียบกับค่าปรับจริงที่บันทึกแล้ว (ตอนคืนแล้ว)
  const liveFine = overdueDays * fineAmount;
  const displayFine = borrow?.isReturned ? (borrow?.fine ?? 0) : liveFine + (borrow?.damaged ?? 0);

  return (
    <div>
      <div className="">
        <div className="flex justify-between items-center py-4 sm:py-6 px-6 border rounded-sm sm:px-12 mb-2 ">
          <h2 className=" text-xl font-semibold">รายละเอียดการคืนหนังสือ</h2>
          <button
            className=" hover:text-red-500 transition-all"
            onClick={() => router.back()}
          >
            <X />
          </button>
        </div>
        <div className="grid sm:grid-cols-12 gap-2 sm:gap-5">
          <div className="sm:col-span-8 py-4 sm:py-6 px-6 border rounded-sm">
            <div className="text-lg font-semibold text-center mb-3">
              ข้อมูลการยืม-คืน
            </div>
            <div className="flex gap-x-10">
              <div className="w-1/3">
                {borrow?.book?.imageUrl && (
                  <Image
                    src={borrow.book.imageUrl}
                    width={220}
                    height={220}
                    alt={borrow?.book?.title || "book cover"}
                    className="rounded-sm object-cover"
                  />
                )}
              </div>
              <div className="w-2/3">
                <p>
                  <strong>ชื่อหนังสือ :</strong> {borrow?.book?.title ?? "ไม่ระบุ"}
                </p>
                <p>
                  <strong>ผู้แต่ง :</strong> {borrow?.book?.author ?? "ไม่ระบุ"}
                </p>
                <p>
                  <strong>ราคา :</strong> {borrow?.book?.price ?? 0} บาท
                </p>
                <p>
                  <strong>จำนวนทั้งหมด :</strong> {borrow?.book?.quantity ?? 0} เล่ม
                </p>
                <p>
                  <strong>จำนวนคงเหลือ :</strong> {borrow?.book?.remaining ?? 0} เล่ม
                </p>

                <p className="mt-5 sm:mt-10">
                  <strong>วันที่ยืม :</strong>{" "}
                  {borrow?.borrowDate ? moment(borrow.borrowDate).format("lll") : "-"}
                </p>
                <p>
                  <strong>กำหนดส่ง :</strong>{" "}
                  {borrow?.dueDate ? moment(borrow.dueDate).format("lll") : "-"}
                </p>
                <p>
                  <strong>วันที่ส่งคืน :</strong>{" "}
                  {borrow?.returnDate ? moment(borrow.returnDate).format("lll") : "-"}
                </p>
                <p><strong>จำนวนวันที่กำหนดยืม :</strong> {borrow?.numberOfDays ?? 0} วัน</p>
                <p>
                  <strong>จำนวนวันที่เกินกำหนด :</strong>{" "}
                  <span className="text-red-800 dark:text-red-500 font-bold">
                    {overdueDays}
                  </span>{" "}
                  วัน
                </p>

                <p>
                  <strong>สถานะ :</strong>{" "}
                  <span
                    className={`${
                      borrow?.status === "BORROWED"
                        ? "text-yellow-800 dark:text-yellow-500"
                        : borrow?.status === "RETURNED"
                        ? "text-green-800 dark:text-green-500"
                        : borrow?.status === "OVERDUE"
                        ? "text-orange-800 dark:text-orange-500"
                        : borrow?.status === "LOST"
                        ? "text-red-800 dark:text-red-500"
                        : ""
                    }`}
                  >
                    {borrow?.status === "BORROWED"
                      ? "กำลังยืม"
                      : borrow?.status === "RETURNED"
                      ? "ส่งคืนแล้ว"
                      : borrow?.status === "OVERDUE"
                      ? "เกินกำหนด"
                      : borrow?.status === "LOST"
                      ? "สูญหาย"
                      : "ไม่ระบุ"}
                  </span>
                </p>
                <p>
                  <strong>ส่งคืน :</strong>{" "}
                  <span
                    className={
                      borrow?.isReturned === false
                        ? "text-red-800 dark:text-red-500"
                        : "text-green-800 dark:text-green-500"
                    }
                  >
                    {borrow?.isReturned === false
                      ? "ยังไม่ส่งคืน"
                      : "ส่งคืนแล้ว"}
                  </span>
                </p>
                <p className="flex items-center space-x-2">
                  <strong>สูญหาย :</strong>{" "}
                  {borrow?.status === "LOST" ? (
                    <span className="text-red-800 dark:text-red-500 font-bold">
                      สูญหาย
                    </span>
                  ) : (
                    <span className="text-green-800 dark:text-green-500">
                      ไม่สูญหาย
                    </span>
                  )}
                </p>
                <p className="mt-5 sm:mt-10">
                  <strong>ค่าปรับระบบ :</strong>{" "}
                  <span>{(currentFineRate * 100).toLocaleString()}</span> % ของหนังสือ
                </p>
                <p>
                  <strong>ค่าปรับเล่มละ :</strong>{" "}
                  <span>{fineAmount.toLocaleString()}</span> บาท / วัน
                </p>
                <p className="flex items-center">
                  <strong>ค่าเสียหายเพิ่มเติม : </strong>
                  <span className="text-red-800 dark:text-red-500 font-bold mx-2">
                    {(borrow?.damaged ?? 0).toLocaleString()}
                  </span>
                  บาท
                </p>

                <p>
                  <strong>ค่าปรับรวมสุทธิ :</strong>
                  <span className="text-red-800 dark:text-red-500 font-bold text-lg mx-2">
                    {displayFine.toLocaleString()}
                  </span>
                  บาท
                  {!borrow?.isReturned && overdueDays > 0 && (
                    <span className="text-xs text-muted-foreground ml-2">
                      (ประมาณการ ณ วันนี้)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="sm:col-span-4 space-y-2 sm:space-y-5">
            <div className="py-4 sm:py-6 px-6 border rounded-sm">
              <div className="text-lg font-semibold mb-3 text-center">
                ข้อมูลผู้ยืม
              </div>
              <div>
                <div className=" flex justify-center">
                  {borrow?.borrower?.profileImage &&
                  borrow.borrower.profileImage.length > 0 ? (
                    <Image
                      src={borrow.borrower.profileImage}
                      width={100}
                      height={100}
                      alt="profile"
                      className="mb-3 rounded-sm object-cover"
                    />
                  ) : null}
                </div>
                <p>
                  <strong>ชื่อ :</strong> {borrow?.borrower?.prefix ?? ""}{" "}
                  {borrow?.borrower?.fullName ?? "ไม่ระบุ"}
                </p>
                <p>
                  <strong>หมายเลขประจำตัว :</strong>{" "}
                  {borrow?.borrower?.codeNumber ?? "-"}
                </p>
                <p>
                  <strong>เบอร์โทร :</strong> {borrow?.borrower?.phoneNumber ?? "-"}
                </p>
                <p>
                  <strong>ระดับการศึกษา :</strong>{" "}
                  {borrow?.borrower?.educationLevel ?? ""}{" "}
                  {borrow?.borrower?.educationYear ?? ""}
                </p>
              </div>
            </div>
            <div className="py-4 sm:py-6 px-6 border rounded-sm">
              <div className="text-lg font-semibold mb-3 text-center">
                ข้อมูลผู้อนุมัติการยืม
              </div>
              <div>
                <div className=" flex justify-center">
                  {borrow?.approver?.profileImage &&
                  borrow.approver.profileImage.length > 0 ? (
                    <Image
                      src={borrow.approver.profileImage}
                      width={100}
                      height={100}
                      alt="approver profile"
                      className="mb-3 rounded-sm object-cover"
                    />
                  ) : null}
                </div>
                <p>
                  <strong>ชื่อ :</strong> {borrow?.approver?.prefix ?? ""}{" "}
                  {borrow?.approver?.fullName ?? "ไม่ระบุ"}
                </p>
                <p>
                  <strong>หมายเลขประจำตัว :</strong>{" "}
                  {borrow?.approver?.codeNumber ?? "-"}
                </p>
              </div>
            </div>
            {borrow?.returnApprover && (
              <div className="py-4 sm:py-6 px-6 border rounded-sm">
                <div className="text-lg font-semibold mb-3 text-center">
                  ข้อมูลผู้อนุมัติการคืน
                </div>
                <div>
                  <div className=" flex justify-center">
                    {borrow.returnApprover.profileImage &&
                    borrow.returnApprover.profileImage.length > 0 ? (
                      <Image
                        src={borrow.returnApprover.profileImage}
                        width={100}
                        height={100}
                        alt="return approver profile"
                        className="mb-3 rounded-sm object-cover"
                      />
                    ) : null}
                  </div>
                  <p>
                    <strong>ชื่อ :</strong> {borrow.returnApprover.prefix ?? ""}{" "}
                    {borrow.returnApprover.fullName ?? "-"}
                  </p>
                  <p>
                    <strong>หมายเลขประจำตัว :</strong>{" "}
                    {borrow.returnApprover.codeNumber ?? "-"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}