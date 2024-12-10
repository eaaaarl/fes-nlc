import { loginStudentValues } from "@/lib/validation";

export async function loginStudent(payload: loginStudentValues) {
  const response = await fetch(`/api/auth/student-login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "(f): Failed to login");
  }
  return response.json();
}
