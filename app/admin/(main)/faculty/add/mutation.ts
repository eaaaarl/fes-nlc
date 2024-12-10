import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Create } from "./action";

export function useCreate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: Create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["create", "faculty"] });

      toast({
        description: "Faculty created.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to create faculty.",
      });
    },
  });
}
