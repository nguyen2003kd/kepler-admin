"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { DataTable } from "@/components/shared/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useContactColumns,
  ContactEditDialog,
  ContactViewDialog,
} from "./components";
import { useContactData, useContactDetail, useContactMutations } from "./hooks";
import type { Contact } from "@/types";

const TYPE_OPTIONS = [
  { value: "all", label: "Tất cả loại" },
  { value: "lien-he-kepler", label: "Liên hệ Kepler" },
  { value: "lien-he-hop-tac", label: "Liên hệ hợp tác" },
  { value: "yeu-cau-ban-cho-thue", label: "Bán/cho thuê BĐS" },
  { value: "yeu-cau-tham-dinh-gia", label: "Thẩm định giá" },
  { value: "yeu-cau-dich-vu", label: "Yêu cầu dịch vụ" },
  { value: "tu-van-thuong-vu-ma", label: "Tư vấn M&A" },
  { value: "dat-lich-hen-chuyen-gia", label: "Đặt lịch chuyên gia" },
  { value: "general", label: "Chung" },
];

export default function ContactPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("all");
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(
    null
  );

  // Data hooks
  const {
    contacts,
    totalCount,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useContactData(searchTerm, selectedType === "all" ? undefined : selectedType);

  const contactDetail = useContactDetail(selectedContact?.id);

  const {
    formData,
    setFormData,
    resetForm,
    setFormFromContact,
    handleUpdate,
    handleDelete,
    isUpdating,
  } = useContactMutations(refetch);

  // Handlers
  const handleViewClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setFormFromContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    handleDelete(id);
  };

  const handleUpdateContact = () => {
    if (selectedContact?.id) {
      handleUpdate(selectedContact.id);
      setIsEditDialogOpen(false);
      resetForm();
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    resetForm();
  };

  // Columns with action handlers
  const columns = useContactColumns({
    onView: handleViewClick,
    onEdit: handleEditClick,
    onDelete: handleDeleteContact,
  });

  return (
    <div>
      <Header title="Quản lý Liên hệ" />
      <main className="container mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Quản lý Liên hệ
              </h2>
              <p className="text-muted-foreground">
                Quản lý các liên hệ từ khách hàng
              </p>
            </div>
          </div>

          {/* Contacts DataTable */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách liên hệ</CardTitle>
              <CardDescription>Tổng cộng: {totalCount} liên hệ</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={contacts}
                searchPlaceholder="Tìm kiếm theo tên, email hoặc điện thoại..."
                isLoading={isLoading}
                onRefresh={refetch}
                onLoadMore={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                onSearch={setSearchTerm}
                extraFilters={
                  <div className="w-48">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Lọc theo loại" />
                      </SelectTrigger>
                      <SelectContent>
                        {TYPE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
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

      {/* Edit Dialog */}
      <ContactEditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleUpdateContact}
        onCancel={handleCancelEdit}
        isPending={isUpdating}
      />

      {/* View Dialog */}
      <ContactViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        contact={contactDetail}
      />
    </div>
  );
}
