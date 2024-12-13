import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editStudent } from "./action";
import { studentEditValues } from "@/lib/validation";

export function useEditStudent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: studentEditValues }) =>
      editStudent(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["create", "student"] });
      toast({
        description: "Student updated.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: error.message || "Failed to edit student",
      });
    },
  });
}
