import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, logoutStudent } from "./action";

export function useLogoutStudent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logout-student"] });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.message || "(mt): Failed to logout",
      });
    },
  });
}

export function useChangePassword() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changePassword-student"] });
      toast({
        variant: "default",
        description: "Password changed successfully.",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        description: error.message || "(mt): Failed to change password",
      });
    },
  });
}
