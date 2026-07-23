import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePutApiV10QuotationId } from "@api/endpoints/quotation";
import { postApiV10File } from "@/api/endpoints/file";
import type { PostApiV10File200 } from "@/api/models";
import { toast } from "@components/ui/toaster";
import baseConfig from "@/configs/base";
import { extractErrorMessage } from "@/utils/error";
import { useAbility } from "@/hooks/use-ability";
import type { QuotationRow, EmailModalState } from "../types";
import { getString, getNestedObj, validateFile } from "../utils";

export const useEmailModal = () => {
  const ability = useAbility();
  const canAddAttachment = ability.can("add_attachment", "quotation");

  const [modalState, setModalState] = useState<EmailModalState>({
    open: false,
    quotation: null,
    price: "",
    status: "",
    files: [],
    fileError: null,
    isSending: false,
  });
  const [confirmState, setConfirmState] = useState(false);

  const queryClient = useQueryClient();
  const putMut = usePutApiV10QuotationId();

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
      isSending: false,
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
      isSending: false,
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

  const handleSendEmail = async () => {
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

  const confirmSendEmail = async () => {
    setConfirmState(false);
    if (!modalState.quotation) return;

    setModalState((prev) => ({ ...prev, isSending: true }));
    try {
      const uploadedFiles: Array<{ name: string; path: string }> = [];

      if (canAddAttachment) {
        // Upload files first and get paths
        for (const file of modalState.files) {
          try {
            const uploadResponse = await postApiV10File({
              file,
              title: file.name,
              is_in_library: false,
            });

            const responseData = (uploadResponse as PostApiV10File200)
              ?.responseData as Record<string, unknown> | undefined;
            const filePath = (responseData?.path ||
              responseData?.url ||
              responseData?.file_path) as string | undefined;

            if (filePath) {
              uploadedFiles.push({
                name: file.name,
                path: filePath,
              });
            } else {
              throw new Error(`Không thể lấy đường dẫn cho file ${file.name}`);
            }
          } catch (uploadErr) {
            throw new Error(
              `Lỗi khi upload file ${file.name}: ${extractErrorMessage(uploadErr)}`,
            );
          }
        }

        if (uploadedFiles.length === 0) {
          throw new Error("Không có file nào được upload thành công");
        }
      }

      // Prepare JSON payload
      const payload = {
        emailType: "update",
        quotationCode: getString(modalState.quotation, "code") || "",
        name: getString(modalState.quotation, "name") || "",
        organizationName:
          getString(modalState.quotation, "organization_name") || "",
        phoneNumber: getString(modalState.quotation, "phone_number") || "",
        email: getString(modalState.quotation, "email") || "",
        description: getString(modalState.quotation, "description") || "",
        statusName:
          getString(
            getNestedObj(modalState.quotation, "quotation_status"),
            "name",
          ) || "Mới tạo",
        receiveMethod:
          getString(
            getNestedObj(modalState.quotation, "receive_method"),
            "name",
          ) || "",
        responseTime:
          getString(modalState.quotation, "created_at") ||
          new Date().toISOString(),
        price: modalState.price,
        files: uploadedFiles,
      };

      const response = await fetch(
        `${baseConfig.backendDomain}/api/v1.0/email/send-quotation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gửi email thất bại");
      }

      toast.success({
        title: "Thành công",
        content: "Đã gửi email báo giá cho khách hàng",
      });

      // Update status if changed
      const quotationId = getString(modalState.quotation, "id");
      const currentStatusId =
        getString(
          getNestedObj(modalState.quotation, "quotation_status"),
          "id",
        ) ||
        getString(modalState.quotation, "quotation_status_id") ||
        "";

      if (quotationId && modalState.status && modalState.status !== currentStatusId) {
        try {
          await putMut.mutateAsync({
            id: quotationId,
            data: { quotation_status_id: modalState.status },
          });
        } catch (statusErr) {
          console.error("Failed to update status:", statusErr);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["quotations"] });
      closeModal();
    } catch (err: unknown) {
      const msg = extractErrorMessage(err);
      toast.error({ title: "Lỗi", content: msg });
    } finally {
      setModalState((prev) => ({ ...prev, isSending: false }));
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
    handleSendEmail,
    confirmSendEmail,
    cancelConfirm: () => setConfirmState(false),
  };
};
