import { evaluationValues } from "@/lib/validation";

export async function submitEvaluation(
  studentId: string,
  payload: evaluationValues
) {
  const response = await fetch(
    `/api/student/submitEvaluation?studentId=${studentId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "(f): Failed to submit evaluation");
  }

  return response.json();
}
