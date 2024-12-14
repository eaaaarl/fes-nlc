import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitEvaluation } from "./action";
import { evaluationValues } from "@/lib/validation";

export function useSubmitEvaluation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      payload,
    }: {
      studentId: string;
      payload: evaluationValues;
    }) => submitEvaluation(studentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "submit-evaluation" ||
          query.queryKey.includes("subject") ||
          query.queryKey.includes("evaluation") ||
          query.queryKey.includes("results"),
      });

      toast({
        description: "Evaluation Completed! Proceeding to Next Faculty.",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: error.message || "(mt): Failed to submit evaluation",
      });
    },
  });
}
