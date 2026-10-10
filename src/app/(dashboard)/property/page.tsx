"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Header } from "@/components/layout/header";
import { DataTable } from "@/components/shared/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { GROUP_OPTIONS } from "./constants";
import { PropertyFormDialog, usePropertyColumns } from "./components";
import { usePropertyData, usePropertyMutations } from "./hooks";

export default function PropertyPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedGroup, setSelectedGroup] = React.useState("all");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedProperty, setSelectedProperty] = React.useState<Property | null>(
    null,
  );

  const ability = useAbility();
  const canCreate =
    ability.can("create", "property") || ability.can("create_post_info", "news");

  const { properties, totalCount, isLoading, refetch } = usePropertyData(
    searchTerm,
    selectedGroup === "all" ? undefined : selectedGroup,
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
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
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

          <Card>
            <CardHeader>
              <CardTitle>Danh sách bất động sản</CardTitle>
              <CardDescription>
                Tổng cộng: {totalCount} bất động sản
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
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
