"use client";

import React from "react";
import { toast } from "sonner";
import {
  useGetApiV10Contact,
  usePutApiV10ContactId,
  useDeleteApiV10ContactId,
  useGetApiV10ContactId,
} from "@/api/endpoints/contact";
import { ContactMutate } from "@/api/models";
import type { Contact } from "@/types";

export function useContactData(searchTerm: string) {
  const { data: contactsResponse, isLoading, refetch } = useGetApiV10Contact({
    pageSize: 100,
    filters: searchTerm ? `name~${searchTerm}` : undefined,
  });

  const contacts = React.useMemo(() => {
    const rows = contactsResponse?.responseData?.rows;
    if (!rows || !Array.isArray(rows)) return [];
    return rows.map((row) => row as unknown as Contact);
  }, [contactsResponse]);

  const totalCount = contactsResponse?.responseData?.count || 0;

  return {
    contacts,
    totalCount,
    isLoading,
    fetchNextPage: () => {},
    hasNextPage: false,
    isFetchingNextPage: false,
    refetch,
  };
}

export function useContactDetail(contactId: string | undefined) {
  const { data: contactDetailResponse } = useGetApiV10ContactId(
    contactId || "",
    { query: { enabled: !!contactId } }
  );

  return contactDetailResponse?.responseData || null;
}

export function useContactMutations(refetch: () => void) {
  const [formData, setFormData] = React.useState<ContactMutate>({
    name: "",
    email: "",
    phone_number: "",
    content: "",
  });

  const updateContactMutation = usePutApiV10ContactId({
    mutation: {
      onSuccess: () => {
        toast.success("Liên hệ đã được cập nhật thành công");
        refetch();
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi cập nhật liên hệ");
      },
    },
  });

  const deleteContactMutation = useDeleteApiV10ContactId({
    mutation: {
      onSuccess: () => {
        toast.success("Liên hệ đã được xóa thành công");
        refetch();
      },
      onError: () => {
        toast.error("Có lỗi xảy ra khi xóa liên hệ");
      },
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      content: "",
    });
  };

  const setFormFromContact = (contact: Contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      phone_number: contact.phone_number || "",
      content: contact.content || "",
    });
  };

  const handleUpdate = (contactId: string) => {
    updateContactMutation.mutate({ id: contactId, data: formData });
  };

  const handleDelete = (id: string) => {
    deleteContactMutation.mutate({ id });
  };

  return {
    formData,
    setFormData,
    resetForm,
    setFormFromContact,
    handleUpdate,
    handleDelete,
    isUpdating: updateContactMutation.isPending,
    isDeleting: deleteContactMutation.isPending,
  };
}
