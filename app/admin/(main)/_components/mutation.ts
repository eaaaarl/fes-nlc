import { useToast } from "@/hooks/use-toast";
import { ChangePasswordAdminValues } from "@/lib/validation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogoutAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "(f): Failed to logout");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logout-admin"] });
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

export function useChangePasswordAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload }: { payload: ChangePasswordAdminValues }) => {
      const response = await fetch(`/api/admin/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "(f): Failed to change password");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["changePassword-admin"] });
      toast({
        description: "Password changed successfully.",
      });
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
