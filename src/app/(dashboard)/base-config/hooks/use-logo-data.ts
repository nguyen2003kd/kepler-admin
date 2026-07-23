"use client";

import { toast } from "sonner";
import {
  useGetApiV10Logo,
  usePostApiV10Logo,
  usePutApiV10LogoId,
  useDeleteApiV10LogoId,
} from "@/api/endpoints/logo";
import { LogoMutate } from "@/api/models/logoMutate";

export function useLogoData() {
  const {
    data: logosData,
    isLoading: logosLoading,
    refetch: refetchLogos,
  } = useGetApiV10Logo();

  const logos = logosData?.responseData?.rows || [];

  return {
    logos,
    logosLoading,
    refetchLogos,
  };
}

export function useLogoMutations(refetchLogos: () => void) {
  const createLogoMutation = usePostApiV10Logo();
  const updateLogoMutation = usePutApiV10LogoId();
  const deleteLogoMutation = useDeleteApiV10LogoId();

  const handleCreateLogo = async (data: LogoMutate, onSuccess?: () => void) => {
    try {
      await createLogoMutation.mutateAsync({ data });
      toast.success("Logo đã được tạo thành công");
      onSuccess?.();
      refetchLogos();
    } catch (error: unknown) {
      console.error("Create logo error:", error);
      toast.error("Có lỗi xảy ra khi tạo logo");
    }
  };

  const handleUpdateLogo = async (
    id: string,
    data: LogoMutate,
    onSuccess?: () => void
  ) => {
    try {
      await updateLogoMutation.mutateAsync({ id, data });
      toast.success("Logo đã được cập nhật thành công");
      onSuccess?.();
      refetchLogos();
    } catch (error: unknown) {
      console.error("Update logo error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật logo");
    }
  };

  const handleDeleteLogo = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa logo này?")) return;

    try {
      await deleteLogoMutation.mutateAsync({ id });
      toast.success("Logo đã được xóa thành công");
      refetchLogos();
    } catch (error: unknown) {
      console.error("Delete logo error:", error);
      toast.error("Có lỗi xảy ra khi xóa logo");
    }
  };

  return {
    handleCreateLogo,
    handleUpdateLogo,
    handleDeleteLogo,
    isCreating: createLogoMutation.isPending,
    isUpdating: updateLogoMutation.isPending,
    isDeleting: deleteLogoMutation.isPending,
  };
}
