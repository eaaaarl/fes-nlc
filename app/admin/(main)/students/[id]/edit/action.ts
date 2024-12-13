import { studentEditValues } from "@/lib/validation";

export async function editStudent(id: string, payload: studentEditValues) {
  const response = await fetch(`/api/admin/student/${id}/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to edit student");
  }

  return response.json();
}
