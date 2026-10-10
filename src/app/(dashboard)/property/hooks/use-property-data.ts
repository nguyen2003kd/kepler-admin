"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  useGetApiV10Property,
  usePostApiV10Property,
  usePutApiV10PropertyId,
} from "@/api/endpoints/property";
import type { Property } from "@/api/models/property";
import type { PropertyMutate } from "@/api/models/propertyMutate";
import { extractErrorMessage } from "@/utils/error";

export function usePropertyData(searchTerm: string, groupFilter?: string) {
  const filterParts = [
    searchTerm ? `title~${searchTerm}` : null,
    groupFilter ? `transaction_group==${groupFilter}` : null,
  ].filter(Boolean);

  const { data, isLoading, refetch } = useGetApiV10Property({
    scope: "ADMIN",
    pageSize: 100,
    filters: filterParts.length > 0 ? filterParts.join(" , ") : undefined,
    sortField: "created_at",
    sortOrder: "desc",
  });

  const properties = React.useMemo(() => {
    const rows = data?.responseData?.rows;
    if (!rows || !Array.isArray(rows)) return [];
    return rows as Property[];
  }, [data]);

  const totalCount = data?.responseData?.count || 0;

  return {
    properties,
    totalCount,
    isLoading,
    refetch,
  };
}

export function usePropertyMutations(refetch: () => void) {
  const queryClient = useQueryClient();

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["/api/v1.0/property"] });
    refetch();
  };

  const createMutation = usePostApiV10Property({
    mutation: {
      onSuccess: async () => {
        toast.success("Đã thêm bất động sản thành công");
        await invalidate();
      },
      onError: (error) => {
        toast.error(extractErrorMessage(error));
      },
    },
  });

  const updateMutation = usePutApiV10PropertyId({
    mutation: {
      onSuccess: async () => {
        toast.success("Đã cập nhật bất động sản thành công");
        await invalidate();
      },
      onError: (error) => {
        toast.error(extractErrorMessage(error));
      },
    },
  });

  const handleCreate = (data: PropertyMutate) => {
    createMutation.mutate({ data });
  };

  const handleUpdate = (id: string, data: PropertyMutate) => {
    updateMutation.mutate({ id, data });
  };

  return {
    handleCreate,
    handleUpdate,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
}
