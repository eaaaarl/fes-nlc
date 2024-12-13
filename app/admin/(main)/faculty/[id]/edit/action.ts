import { facultyEditValues } from "@/lib/validation";

export async function editFaculty(id: string, payload: facultyEditValues) {
  const response = await fetch(`/api/admin/faculty/${id}/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to edit faculty");
  }

  return await response.json();
}
