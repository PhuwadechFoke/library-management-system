"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import ImageInput from "@/components/formInputs/ImageInput";
import SelectInput from "@/components/formInputs/SelectInput";
import SubmitButton from "@/components/formInputs/SubmitButton";
import TextAreaInput from "@/components/formInputs/TextArealInput";
import TextInput from "@/components/formInputs/TextInput";
import { isLoading } from "@/redux/slices/loadingFullScreenSlice";
import { queryClient } from "@/lib/react-query-client";

const prefixes = ["นาย", "นาง", "นางสาว"].map((value) => ({
  id: value,
  title: value,
}));

const educationLevels = ["ปวช", "ปวส", "ป.ตรี"].map((value) => ({
  id: value,
  title: value,
}));

const educationYears = ["1", "2", "3"].map((value) => ({
  id: value,
  title: value,
}));

export default function UserForm({ updateData }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(updateData?.profileImage || "");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: updateData?.username || "",
      emailAddress: updateData?.emailAddress || "",
      prefix: updateData?.prefix || "",
      fullName: updateData?.fullName || "",
      codeNumber: updateData?.codeNumber || "",
      phoneNumber: updateData?.phoneNumber || "",
      educationLevel: updateData?.educationLevel || "",
      educationYear: updateData?.educationYear || "",
      description: updateData?.description || "",
    },
  });

  const onSubmit = async (data) => {
    dispatch(isLoading(true));
    try {
      const response = await fetch(`/api/admin/users/${updateData.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, profileImage: imageUrl }),
      });
      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message || "เกิดข้อผิดพลาดในการแก้ไขผู้ใช้");
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["users"] });
      await queryClient.invalidateQueries({ queryKey: ["user", updateData.userId] });
      toast.success("อัพเดทข้อมูลผู้ใช้งานสำเร็จ");
      router.replace("/dashboard/users");
      router.refresh();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้");
    } finally {
      dispatch(isLoading(false));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full rounded-sm border p-4 sm:p-6 md:p-8"
    >
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <TextInput label="ชื่อผู้ใช้" name="username" register={register} errors={errors} />
        <TextInput
          label="อีเมล"
          name="emailAddress"
          type="email"
          register={register}
          errors={errors}
        />
        <SelectInput
          label="คำนำหน้า"
          name="prefix"
          register={register}
          options={prefixes}
        />
        <TextInput
          label="ชื่อ-นามสกุล"
          name="fullName"
          register={register}
          errors={errors}
          isRequired={false}
        />
        <TextInput
          label="รหัสนักศึกษา"
          name="codeNumber"
          register={register}
          errors={errors}
          isRequired={false}
        />
        <TextInput
          label="เบอร์โทรศัพท์"
          name="phoneNumber"
          register={register}
          errors={errors}
          isRequired={false}
        />
        <SelectInput
          label="ระดับการศึกษา"
          name="educationLevel"
          register={register}
          options={educationLevels}
        />
        <SelectInput
          label="ชั้นปี"
          name="educationYear"
          register={register}
          options={educationYears}
        />
        <TextAreaInput
          label="รายละเอียด"
          name="description"
          register={register}
          errors={errors}
          isRequired={false}
          className="sm:col-span-2"
        />
        <ImageInput
          label="รูปโปรไฟล์"
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          endpoint="userProfileUploader"
          className="sm:col-span-2"
        />
        <div className="col-span-full flex justify-end">
          <SubmitButton buttonTitle="บันทึกข้อมูลผู้ใช้" />
        </div>
      </div>
    </form>
  );
}
