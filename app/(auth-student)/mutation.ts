import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginStudent } from "./action";

export function useLoginStudent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["login-student"] });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.message || "(mt): Failed to submit",
      });
    },
  });
}
