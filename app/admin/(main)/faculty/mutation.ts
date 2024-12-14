import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFaculty } from "./action";

export function useDeleteFaculty() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["create", "faculty"] });

      toast({
        description: "Faculty deleted.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: error.message || "Failed to delete faculty",
      });
    },
  });
}
