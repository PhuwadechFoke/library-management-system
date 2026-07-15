"use client";
import { makePostRequest, makePutRequest } from "@/lib/apiRequest";
import { generateSlug } from "@/lib/generateSlug";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import MultipleImageInput from "@/components/formInputs/MultipleImageInput";
import SelectInput from "@/components/formInputs/SelectInput";
import SubmitButton from "@/components/formInputs/SubmitButton";
import TextAreaInput from "@/components/formInputs/TextArealInput";
import TextInput from "@/components/formInputs/TextInput";
import { queryClient } from "@/lib/react-query-client";
import { isLoading } from "@/redux/slices/loadingFullScreenSlice";

export default function BookForm({
  updateData = {},
  categories = [],
  loading,
  adminId,
}) {
  const dispatch = useDispatch();

  const initialImageUrls = Array.isArray(updateData?.imageUrls) ? updateData.imageUrls : [];
  const id = updateData?.id ?? "";
  const [imageUrls, setImageUrls] = useState(initialImageUrls);

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
      title: updateData?.title ?? "",
      price: updateData?.price ?? 0,
      quantity: updateData?.quantity ?? 0,
      remaining: updateData?.remaining ?? 0,
      author: updateData?.author ?? "",
      categoryId: updateData?.categoryId ?? "",
      description: updateData?.description ?? "",
    },
  });

  const router = useRouter();
  const onSuccess = async () => {
    // ล้างรูปภาพเฉพาะเมื่อบันทึกสำเร็จเท่านั้น
    setImageUrls([]); 
    await queryClient.invalidateQueries(["books", "booksAll", "booksNewBooks"]);
    router.replace("/dashboard/books");
    router.refresh();
  };

  const onSubmit = async (data) => {
    if (!imageUrls || imageUrls.length === 0) {
      toast.error("กรุณาเลือกและอัปโหลดรูปภาพปกหนังสือ");
      return;
    }

    const slug = generateSlug(data.title || "book");

    const payload = {
      ...data,
      slug,
      imageUrls,
      adminId,
      price: parseFloat(data.price) || 0,
      quantity: parseInt(data.quantity, 10) || 0,
      remaining: id
        ? parseInt(data.remaining, 10) || 0
        : parseInt(data.quantity, 10) || 0,
    };

    if (id) {
      makePutRequest(
        `api/admin/books/${id}`,
        payload,
        "หนังสือ",
        onSuccess,
        reset,
        dispatch
      );
    } else {
      makePostRequest(
        "api/admin/books",
        payload,
        "หนังสือ",
        onSuccess,
        reset,
        dispatch
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full p-4 border rounded-sm sm:p-6 md:p-8 mx-auto"
    >
      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <TextInput
          label="ชื่อหนังสือ"
          name="title"
          register={register}
          errors={errors}
          isRequired={true}
        />
        <div className="grid gap-2 grid-cols-2">
          <TextInput
            label="ราคาหนังสือ"
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
          />
        </div>
        <TextInput
          label="ชื่อผู้แต่ง"
          name="author"
          register={register}
          errors={errors}
        />
        <div className="grid gap-2 grid-cols-2">
          <SelectInput
            label="หมวดหมู่"
            name="categoryId"
            register={register}
            errors={errors}
            className="w-full"
            options={categories}
          />
          {id && (
            <TextInput
              label="จำนวนคงเหลือ"
              name="remaining"
              type="number"
              register={register}
              errors={errors}
            />
          )}
        </div>

        <TextAreaInput
          label="รายละเอียดหนังสือ"
          name="description"
          className="sm:col-span-2"
          register={register}
          errors={errors}
          isRequired={false}
        />
        <MultipleImageInput
          label="ภาพปกหนังสือ"
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          endpoint="bookImageUploader"
          className="sm:col-span-2"
        />

        <div className="col-span-full flex justify-end">
          <SubmitButton buttonTitle={id ? "อัพเดตหนังสือ" : "เพิ่มหนังสือ"} />
        </div>
      </div>
    </form>
  );
}