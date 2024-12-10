import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminLogin } from "./action";

export function useAdminLogin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: adminLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["login-admin"] });
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
