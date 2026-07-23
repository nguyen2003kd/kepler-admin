import {
  useDeleteApiV10FooterId,
  usePostApiV10Footer,
  usePutApiV10FooterId,
} from "@/api/endpoints/footer";
import { useQueryClient } from "@tanstack/react-query";

export function useFooterMutations() {
  const queryClient = useQueryClient();
  const createMutation = usePostApiV10Footer();
  const updateMutation = usePutApiV10FooterId();
  const deleteMutation = useDeleteApiV10FooterId();

  const invalidateFooters = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/v1.0/footer"] });
  };

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    invalidateFooters,
    queryClient,
  };
}
