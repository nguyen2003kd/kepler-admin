"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { DataTable } from "@/components/shared/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAbility } from "@/hooks/use-ability";
import type { Property } from "@/api/models/property";
import { GROUP_OPTIONS, PROJECT_GROUP_VALUES } from "./constants";
import { PropertyFormDialog, usePropertyColumns } from "./components";
import { usePropertyData, usePropertyMutations } from "./hooks";

export default function PropertyPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedGroup, setSelectedGroup] = React.useState("projects");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(
    null,
  );

  const ability = useAbility();
  const canCreate =
    ability.can("create", "property") || ability.can("create_post_info", "news");

  const groupFilter =
    selectedGroup === "projects"
      ? [...PROJECT_GROUP_VALUES]
      : selectedGroup === "all"
        ? undefined
        : selectedGroup;

  const { properties, isLoading, refetch } = usePropertyData(
    searchTerm,
    groupFilter,
  );

  const { handleCreate, handleUpdate, isSubmitting } = usePropertyMutations(refetch);

  const columns = usePropertyColumns({
    onEdit: (property) => {
      setSelectedProperty(property);
      setIsFormOpen(true);
    },
  });

  const handleAddClick = () => {
    setSelectedProperty(null);
    setIsFormOpen(true);
  };

  const handleSubmit = (
    id: string | undefined,
    data: Parameters<typeof handleCreate>[0],
  ) => {
    if (id) {
      handleUpdate(id, data);
    } else {
      handleCreate(data);
    }
    setIsFormOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div>
      <Header title="Quản lý Bất động sản" />
      <main className="flex-1 space-y-6 p-6">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Quản lý Bất động sản
              </h2>
              <p className="text-muted-foreground">
                Quản lý các bất động sản trên sàn giao dịch
              </p>
            </div>
            {canCreate && (
              <Button onClick={handleAddClick}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm bất động sản
              </Button>
            )}
          </div>

          <DataTable
                columns={columns}
                data={properties}
                searchPlaceholder="Tìm kiếm theo tên bất động sản..."
                isLoading={isLoading}
                onRefresh={refetch}
                onSearch={setSearchTerm}
                extraFilters={
                  <div className="w-48">
                    <Select
                      value={selectedGroup}
                      onValueChange={setSelectedGroup}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Lọc theo nhóm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="projects">
                          Dự án (đầu tư, phân phối, M&A)
                        </SelectItem>
                        <SelectItem value="all">Tất cả nhóm</SelectItem>
                        {GROUP_OPTIONS.map((group) => (
                          <SelectItem key={group.value} value={group.value}>
                            {group.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                }
          />
        </div>
      </main>

      <PropertyFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setSelectedProperty(null);
        }}
        onSubmit={handleSubmit}
        initialData={selectedProperty}
        isLoading={isSubmitting}
      />
    </div>
  );
}
