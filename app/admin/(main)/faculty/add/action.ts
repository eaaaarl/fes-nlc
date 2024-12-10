import { facultyValues } from "@/lib/validation";

export async function Create(payload: facultyValues) {
  const response = await fetch(`/api/admin/faculty/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to create");
  }

  return response.json();
}
