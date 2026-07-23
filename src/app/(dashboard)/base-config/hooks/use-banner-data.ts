"use client";

import { toast } from "sonner";
import {
  useGetApiV10Banner,
  usePostApiV10Banner,
  usePutApiV10BannerId,
  useDeleteApiV10BannerId,
} from "@/api/endpoints/banner";
import { BannerMutate } from "@/api/models/bannerMutate";

export function useBannerData() {
  const {
    data: bannersData,
    isLoading: bannersLoading,
    refetch: refetchBanners,
  } = useGetApiV10Banner();

  const banners = bannersData?.responseData?.rows || [];

  return {
    banners,
    bannersLoading,
    refetchBanners,
  };
}

export function useBannerMutations(refetchBanners: () => void) {
  const createBannerMutation = usePostApiV10Banner();
  const updateBannerMutation = usePutApiV10BannerId();
  const deleteBannerMutation = useDeleteApiV10BannerId();

  const handleCreateBanner = async (
    data: BannerMutate,
    onSuccess?: () => void
  ) => {
    try {
      await createBannerMutation.mutateAsync({ data });
      toast.success("Banner đã được tạo thành công");
      onSuccess?.();
      refetchBanners();
    } catch (error: unknown) {
      console.error("Create banner error:", error);
      toast.error("Có lỗi xảy ra khi tạo banner");
    }
  };

  const handleUpdateBanner = async (
    id: string,
    data: BannerMutate,
    onSuccess?: () => void
  ) => {
    try {
      await updateBannerMutation.mutateAsync({ id, data });
      toast.success("Banner đã được cập nhật thành công");
      onSuccess?.();
      refetchBanners();
    } catch (error: unknown) {
      console.error("Update banner error:", error);
      toast.error("Có lỗi xảy ra khi cập nhật banner");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa banner này?")) return;

    try {
      await deleteBannerMutation.mutateAsync({ id });
      toast.success("Banner đã được xóa thành công");
      refetchBanners();
    } catch (error: unknown) {
      console.error("Delete banner error:", error);
      toast.error("Có lỗi xảy ra khi xóa banner");
    }
  };

  const handleSyncAllBannersTime = async (
    banners: Record<string, unknown>[],
    globalDisplayTime: string
  ) => {
    if (
      !confirm(
        `Bạn có chắc chắn muốn đồng bộ thời gian hiển thị ${globalDisplayTime} giây cho tất cả ${banners.length} banner?`
      )
    )
      return;

    try {
      const updatePromises = banners.map((banner: Record<string, unknown>) => {
        const updateData: BannerMutate = {
          name: String(banner.name || ""),
          description: String(banner.description || ""),
          file_id: String((banner.file as Record<string, unknown>)?.id || ""),
          sort_order: String(banner.sort_order || "1"),
          display_time: String(Number(globalDisplayTime) * 1000),
          is_active: Boolean(banner.is_active),
        };
        return updateBannerMutation.mutateAsync({
          id: String(banner.id),
          data: updateData,
        });
      });

      await Promise.all(updatePromises);
      toast.success(
        `Đã đồng bộ thời gian hiển thị cho ${banners.length} banner thành công`
      );
      refetchBanners();
    } catch (error: unknown) {
      console.error("Sync banners time error:", error);
      toast.error("Có lỗi xảy ra khi đồng bộ thời gian hiển thị");
    }
  };

  return {
    handleCreateBanner,
    handleUpdateBanner,
    handleDeleteBanner,
    handleSyncAllBannersTime,
    isCreating: createBannerMutation.isPending,
    isUpdating: updateBannerMutation.isPending,
    isDeleting: deleteBannerMutation.isPending,
  };
}
