import { useToast } from "@/hooks/use-toast";
import { facultyEditValues } from "@/lib/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editFaculty } from "./action";

export function useEditFaculty() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: facultyEditValues }) =>
      editFaculty(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["create", "faculty"] });

      toast({
        description: "Updated faculty.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: error.message || "Failed to edit faculty.",
      });
    },
  });
}
