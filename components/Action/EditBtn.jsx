import { Pencil } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function EditBtn({ editEndpoint, title }) {
  return (
    <Link href={`/dashboard/${editEndpoint}`} className=" flex items-center">
      <Pencil className="mr-2 w-4 h-4" />
      <span>แก้ไข{title}</span>
    </Link>
  );
}
