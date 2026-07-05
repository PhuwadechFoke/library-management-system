"use client";

import FormHeader from "@/components/backoffice/FormHeader";
import DepartmentBookForm from "@/components/backoffice/form/DepartmentBookForm";

export default function NewDepartmentBook() {
  return (
    <div>
      <FormHeader title="เพิ่มหนังสือแผนก" loading={false} />
      <DepartmentBookForm loading={false} />
    </div>
  );
}