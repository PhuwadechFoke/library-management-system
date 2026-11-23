import { ArrowUpDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

import React from 'react'
import { useLanguage } from "@/context/LanguageContext";

export default function TitleColumn({column,title,className="-m-4"}) {
    const { t } = useLanguage();
    return (
        <Button
          className={className} 
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t(title)}
          <ArrowUpDown className="ml-2 h-4 w-4 " />
        </Button>
      );
}
