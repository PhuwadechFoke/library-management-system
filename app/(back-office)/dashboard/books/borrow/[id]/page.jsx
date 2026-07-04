"use client";
import DataTable from "@/components/backoffice/data-table-components/DataTable";
import { Skeleton } from "@/components/ui/skeleton";
import { getData } from "@/lib/getData";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { columns } from "./columns";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";

import { addDays, differenceInDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { th } from "date-fns/locale"; 

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FINE_RATE } from "@/lib/constants";

import Swal from "sweetalert2";
import { isLoading } from "@/redux/slices/loadingFullScreenSlice";
import toast from "react-hot-toast";

export default function page({ params: { id } }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector((store) => store.selectBorrowUser.userId);
  const { data: admin } = useSession();
  const adminId = admin?.user?.id;
  const adminName = admin?.user?.username;

  const [date, setDate] = React.useState({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const numberOfDays =
    date?.from && date?.to
      ? Math.round(differenceInDays(date.to, date.from))
      : 0;

  // ดึงข้อมูลหนังสือ
  const {
    data: book,
    isLoading: isBookLoading,
    error: bookError,
  } = useQuery({
    queryKey: ["book", id],
    queryFn: () => getData(`admin/books/${id}`),
  });

  // 🛠 แก้ไขจุดนี้: ใส่ Property Mapping ให้ถูกต้องตาม Spec ของ React Query
  const {
    data: users,
    isLoading: isUsersLoading,
    error: errorUsers,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getData("admin/users"),
  });

  // 🛠 แก้ไขจุดนี้เช่นกัน: Mapping isLoading และ error ให้ถูกต้อง
  const {
    data: userDetail,
    isLoading: isUserDetailLoading,
    error: errorUserDetail,
  } = useQuery({
    queryKey: ["userDetail", userId],
    queryFn: () => getData(`admin/users/${userId}`),
    enabled: !!userId,
  });

  // 🛠 ป้องกันการเกิด NaN ระหว่างรอโหลดข้อมูล (ใส่ Fallback เป็น 0 ไว้ก่อน)
  const bookPrice = book?.price || 0; 
  const fineAmount = FINE_RATE?.DAY ? Math.round(bookPrice * FINE_RATE.DAY) : 0;

  const onSuccess = () => {
    router.push("/dashboard/history");
    router.refresh();
  };

  if (bookError) return <div> Error: {bookError.message}</div>;
  if (errorUsers) return <div> Error: {errorUsers.message}</div>;
  if (errorUserDetail) return <div> Error: {errorUserDetail.message}</div>;

  const onSubmit = async () => {
    // 🛠 เพิ่ม Safeguard ป้องกันกรณีผู้ใช้กดยกเลิกปฏิทินจนค่า date เป็น null/undefined
    if (!date || !date.from || !date.to) {
      toast.error("กรุณาเลือกช่วงเวลาการยืมหนังสือให้ถูกต้อง");
      return;
    }

    Swal.fire({
      title: "คุณแน่ใจมั้ย??",
      text: "คุณต้องการยืมหนังสือเล่มนี้ใช่หรือไม่!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่ ยืนยัน!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        window.scrollTo({ top: 0 });
        const data = {};
        data.bookId = id;
        data.borrowerId = userId;
        data.approverId = adminId;
        data.borrowDate = date.from;
        data.dueDate = date.to;
        data.numberOfDays = numberOfDays;

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        dispatch(isLoading(true));
        try {
          const res = await fetch(`${baseUrl}/api/admin/borrows`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          if (res.status === 400 || res.status === 404) {
            const data = await res.json();
            toast.error(data.message);
            dispatch(isLoading(false));
          }
          if (res.ok) {
            onSuccess();
            toast.success(`ทำการยืมหนังสือสำเร็จ`);
            dispatch(isLoading(false));
          }
        } catch (err) {
          toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
          dispatch(isLoading(false));
        }
      } else {
        dispatch(isLoading(false));
        router.refresh();
      }
    });
  };

  return (
    <div className="">
      {isBookLoading ? (
        <>
          <Skeleton className="sm:flex items-center justify-between py-6 sm:py-8 px-6 sm:px-12 mb-2"></Skeleton>
          <Skeleton className="w-full h-96 mb-2 " />
        </>
      ) : (
        <div className="">
          <div className="flex justify-between items-center py-4 sm:py-6 px-6 border rounded-sm sm:px-12 mb-2 ">
            <h2 className=" text-xl font-semibold">ยืมหนังสือ</h2>
            <button
              className=" hover:text-red-500 transition-all"
              onClick={() => router.back()}
            >
              <X />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full p-4 border rounded-sm sm:p-6 md:p-8 mx-auto ">
            <div className="col-span-1 w-full">
              {/* 🛠 ใส่ Optional Chaining เผื่อกรณียังโหลด object image ไม่เสร็จ */}
              <Image
                src={book?.imageUrl || "/placeholder.png"} 
                alt="Item image"
                width={1000}
                height={667}
                loading="lazy"
                className="w-full h-auto sm:h-80 object-cover rounded-sm"
              />
              <h2 className="text-xl font-semibold mt-2">{book?.title}</h2>
            </div>
            <div className="col-span-3">
              {isUsersLoading ? (
                <Skeleton className="w-full h-40 mb-2" />
              ) : (
                <DataTable
                  data={users || []}
                  columns={columns}
                  filterKeys={["fullName", "codeNumber"]}
                />
              )}
            </div>
          </div>
          {userId ? (
            <div className=" w-full py-4 sm:py-6 px-6 border rounded-sm sm:px-12 my-2">
              <h2 className="text-xl font-semibold mb-5">รายละเอียดการยืม</h2>
              <div className="flex items-center  ">
                {isUserDetailLoading ? (
                  <Skeleton className="w-full h-6 mb-2" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 items-stretch gap-x-10 w-full dark:text-muted-foreground ">
                    <div className="col-span-1">
                      <div className="text-lg font-semibold mb-3">
                        ข้อมูลผู้ยืม
                      </div>
                      <div className="">
                        ชื่อ : {userDetail?.prefix} {userDetail?.fullName}{" "}
                      </div>
                      <div className="">
                        ระดับการศึกษา : {userDetail?.educationLevel}{" "}
                        {userDetail?.educationYear}{" "}
                      </div>
                      <div className="">
                        รหัสนักศึกษา : {userDetail?.codeNumber}{" "}
                      </div>
                      <div className="">
                        เบอร์โทร : {userDetail?.phoneNumber}
                      </div>
                      <div className="text-lg font-semibold mb-3 mt-2 sm:mt-5">
                        ข้อมูลหนังสือ
                      </div>
                      {/* 🛠 ใส่ Optional Chaining ทั้งหมดเพื่อความเสถียรสูงสุด */}
                      <div className="">ชื่อหนังสือ : {book?.title}</div>
                      <div className="">คงเหลือ : {book?.remaining || 0} เล่ม</div>
                      <div className="">จำนวนที่ยืม : 1 เล่ม</div>
                      <div className="">ราคาหนังสือ : {book?.price || 0} บาท</div>
                      <div className="">ค่าสูญหาย : {book?.price || 0} บาท</div>
                      <div className="">
                        ราคาค่าปรับ : {fineAmount} บาท / วัน
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-lg font-semibold mb-3">
                        ผู้อนุมัติ
                      </div>
                      <div className="">ผู้ดูแล : {adminName || "ไม่ระบุ"}</div>

                      <div className="mt-2 sm:mt-24">
                        <div className="text-lg font-semibold mb-3">
                          กำหนดการยืม
                        </div>
                        {date?.from ? (
                          date.to ? (
                            <>
                              <div className="">
                                วันที่ :{" "}
                                {format(date.from, "dd LLLL yyyy HH:mm", {
                                  locale: th,
                                })}
                              </div>
                              <div className="">
                                ถึง :{" "}
                                {format(date.to, "dd LLLL yyyy HH:mm", {
                                  locale: th,
                                })}
                              </div>
                            </>
                          ) : (
                            format(date.from, "dd LLLL yyyy HH:mm", {
                              locale: th,
                            })
                          )
                        ) : null}
                      </div>
                      <div className="">เป็นจำนวน : {numberOfDays} วัน</div>
                    </div>

                    <div className="col-span-1 ">
                      <div className={cn("grid gap-2")}>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-[280px]ห justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "dd LLLL yyyy", {
                                  locale: th,
                                })}{" "}
                                -{" "}
                                {format(date.to, "dd LLLL yyyy", {
                                  locale: th,
                                })}
                              </>
                            ) : (
                              format(date.from, "dd LLLL yyyy", { locale: th })
                            )
                          ) : (
                            <span>เลือกวันที่</span>
                          )}
                        </Button>
                        <div className="w-auto p-0">
                          <Calendar
                            initialFocus
                            mode="range"
                            selected={date}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                const now = new Date();

                                const fromWithTime = new Date(range.from);
                                fromWithTime.setHours(
                                  now.getHours(),
                                  now.getMinutes(),
                                  now.getSeconds()
                                );

                                const toWithTime = new Date(range.to);
                                toWithTime.setHours(
                                  now.getHours(),
                                  now.getMinutes(),
                                  now.getSeconds()
                                );

                                setDate({ from: fromWithTime, to: toWithTime });
                              } else {
                                setDate(range);
                              }
                            }}
                            numberOfMonths={1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="w-full flex justify-end mt-8 relative">
                <Button onClick={() => onSubmit()}>ยืนยันการยืม</Button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}