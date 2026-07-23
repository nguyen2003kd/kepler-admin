import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePostApiV10Quotation } from "@api/endpoints/quotation";
import { toast } from "@components/ui/toaster";
import { extractErrorMessage } from "@/utils/error";
import { useAbility } from "@/hooks/use-ability";
import type { QuotationRow, ResponseModalState } from "../types";
import { getString, getNestedObj, validateFile } from "../utils";

export const useResponseModal = () => {
  const ability = useAbility();
  const canAddAttachment = ability.can("add_attachment", "quotation");

  const [modalState, setModalState] = useState<ResponseModalState>({
    open: false,
    quotation: null,
    price: "",
    status: "",
    files: [],
    fileError: null,
    isSubmitting: false,
  });
  const [confirmState, setConfirmState] = useState(false);

  const queryClient = useQueryClient();
  const postMut = usePostApiV10Quotation();

  const openModal = useCallback((quotation: QuotationRow) => {
    const currentStatusId =
      getString(getNestedObj(quotation, "quotation_status"), "id") ||
      getString(quotation, "quotation_status_id") ||
      "";
    setModalState({
      open: true,
      quotation,
      price: getString(quotation, "price") || "",
      status: currentStatusId,
      files: [],
      fileError: null,
      isSubmitting: false,
    });
  }, []);

  const closeModal = useCallback(() => {
    setModalState({
      open: false,
      quotation: null,
      price: "",
      status: "",
      files: [],
      fileError: null,
      isSubmitting: false,
    });
  }, []);

  const updatePrice = (price: string) => {
    setModalState((prev) => ({ ...prev, price }));
  };

  const updateStatus = (status: string) => {
    setModalState((prev) => ({ ...prev, status }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canAddAttachment) {
      e.target.value = "";
      return;
    }

    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const errors: string[] = [];
      const validFiles: File[] = [];

      for (const file of newFiles) {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push(file);
        }
      }

      setModalState((prev) => ({
        ...prev,
        files: [...prev.files, ...validFiles],
        fileError: errors.length > 0 ? errors.join("; ") : null,
      }));
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setModalState((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      fileError: null,
    }));
  };

  const handleSubmit = async () => {
    if (!modalState.quotation) return;

    if (!modalState.price || modalState.price.trim() === "") {
      toast.error({ title: "Lỗi", content: "Vui lòng nhập giá báo giá" });
      return;
    }

    if (!modalState.status) {
      toast.error({ title: "Lỗi", content: "Vui lòng chọn trạng thái" });
      return;
    }

    if (canAddAttachment && modalState.files.length === 0) {
      toast.error({
        title: "Lỗi",
        content: "Vui lòng chọn ít nhất một file để gửi",
      });
      return;
    }

    setConfirmState(true);
  };

  const confirmSubmit = async () => {
    setConfirmState(false);
    if (!modalState.quotation) return;

    setModalState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      const postData = {
        name: getString(modalState.quotation, "name") || "",
        post_id: getString(modalState.quotation, "post_id") || "",
        phone_number: getString(modalState.quotation, "phone_number") || "",
        email: getString(modalState.quotation, "email") || "",
        description: getString(modalState.quotation, "description") || "",
        price: modalState.price,
        organization_name:
          getString(modalState.quotation, "organization_name") || undefined,
        receive_method_id:
          getString(modalState.quotation, "receive_method_id") ||
          getString(getNestedObj(modalState.quotation, "receive_method"), "id") ||
          undefined,
        calibration_id:
          getString(modalState.quotation, "calibration_id") ||
          getString(getNestedObj(modalState.quotation, "calibration"), "id") ||
          undefined,
        quotation_status_id: modalState.status,
        files: modalState.files.length > 0 ? modalState.files : undefined,
      };

      await postMut.mutateAsync({ data: postData });

      toast.success({
        title: "Thành công",
        content: "Đã phản hồi khách hàng thành công",
      });

      await queryClient.invalidateQueries({ queryKey: ["quotations"] });
      closeModal();
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      toast.error({ title: "Lỗi", content: msg });
    } finally {
      setModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return {
    modalState,
    confirmState,
    openModal,
    closeModal,
    updatePrice,
    updateStatus,
    handleFileSelect,
    removeFile,
    handleSubmit,
    confirmSubmit,
    cancelConfirm: () => setConfirmState(false),
  };
};
