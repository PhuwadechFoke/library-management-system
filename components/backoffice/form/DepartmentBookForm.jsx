"use client";

import MultipleImageInput from "@/components/formInputs/MultipleImageInput";
import SubmitButton from "@/components/formInputs/SubmitButton";
import TextAreaInput from "@/components/formInputs/TextArealInput";
import TextInput from "@/components/formInputs/TextInput";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { generateSlug } from "@/lib/generateSlug";
import { queryClient } from "@/lib/react-query-client";
import { isLoading } from "@/redux/slices/loadingFullScreenSlice";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

export default function DepartmentBookForm({ updateData = {}, loading }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const id = updateData?.id ?? "";
  const [imageUrls, setImageUrls] = useState(updateData?.imageUrls ?? []);

  if (loading) {
    dispatch(isLoading(true));
  }

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...updateData,
    },
  });

  const onSuccess = async () => {
    setImageUrls([]);
    await queryClient.invalidateQueries(["departmentBooks", "departmentsAll"]);
    router.replace("/dashboard/department-books");
    router.refresh();
  };

  const onSubmit = async (data) => {
    if (!data.department?.trim()) {
      toast.error("กรุณาระบุชื่อแผนก");
      return;
    }

    if (!imageUrls || imageUrls.length === 0) {
      toast.error("กรุณาเลือกรูปปกหนังสือแผนก");
      return;
    }

    const slug = generateSlug(`${data.department}-${data.title}`);
    const payload = {
      ...data,
      slug,
      imageUrls,
      price: parseFloat(data.price) || 0,
      quantity: parseInt(data.quantity, 10) || 0,
      remaining: id
        ? parseInt(data.remaining, 10) || 0
        : parseInt(data.quantity, 10) || 0,
    };

    if (id) {
      makePutRequest(
        `api/admin/department-books/${id}`,
        payload,
        "หนังสือแผนก",
        onSuccess,
        reset,
        dispatch
      );
    } else {
      makePostRequest(
        "api/admin/department-books",
        payload,
        "หนังสือแผนก",
        onSuccess,
        reset,
        dispatch
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto w-full rounded-sm border p-4 sm:p-6 md:p-8"
    >
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <TextInput
          label="ชื่อหนังสือแผนก"
          name="title"
          register={register}
          errors={errors}
          isRequired={true}
        />
        <TextInput
          label="ชื่อแผนก"
          name="department"
          register={register}
          errors={errors}
          isRequired={true}
        />
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            label="ราคา"
            name="price"
            type="number"
            register={register}
            errors={errors}
          />
          <TextInput
            label="จำนวนหนังสือ"
            name="quantity"
            type="number"
            register={register}
            errors={errors}
            isRequired={true}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            label="ชื่อผู้แต่ง"
            name="author"
            register={register}
            errors={errors}
          />
          {id ? (
            <TextInput
              label="จำนวนคงเหลือ"
              name="remaining"
              type="number"
              register={register}
              errors={errors}
            />
          ) : null}
        </div>
        <TextAreaInput
          label="รายละเอียดหนังสือแผนก"
          name="description"
          className="sm:col-span-2"
          register={register}
          errors={errors}
          isRequired={false}
        />
        <MultipleImageInput
          label="ภาพปกหนังสือแผนก"
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          endpoint="bookImageUploader"
          className="sm:col-span-2"
        />

        <div className="col-span-full flex justify-end">
          <SubmitButton
            buttonTitle={id ? "อัพเดตหนังสือแผนก" : "เพิ่มหนังสือแผนก"}
          />
        </div>
      </div>
    </form>
  );
}
