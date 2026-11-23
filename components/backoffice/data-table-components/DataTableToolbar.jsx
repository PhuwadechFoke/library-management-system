"use client";

import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./DataTableViewOptions";
import { useLanguage } from "@/context/LanguageContext";

export function DataTableToolbar({ table, filterKeys }) {
  const { t } = useLanguage();
  const isFiltered = filterKeys.some(
    (key) => table.getState().columnFilters[key]?.length > 0
  );

  const handleInputChange = (key, value) => {
    table.getColumn(key)?.setFilterValue(value);
  };

  const handleResetClick = () => {
    filterKeys.forEach((key) => {
      table.getColumn(key)?.setFilterValue("");
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {filterKeys.map((key) => (
          <Input
            key={key}
            placeholder={`${t("common.filter")} ${t(key)}...`}
            value={table.getColumn(key)?.getFilterValue() ?? ""}
            onChange={(event) => handleInputChange(key, event.target.value)}
            className="h-9 w-[150px] sm:w-[200px] lg:w-[250px]"
          />
        ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleResetClick}
            className="h-8 px-2 lg:px-3"
          >
            {t("common.reset")}
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="mx-1 space-x-1 text-sm sm:mx-2">
        <span className="hidden sm:inline text-muted-foreground ">{t("common.all")}</span>
        <span className="font-semibold">{table.getFilteredRowModel().rows.length}</span>
        <span className="text-muted-foreground ">{t("common.items")}</span>
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
