export async function deleteFaculty(params: { id: string }) {
  const { id } = params;
  const response = await fetch(`/api/admin/faculty/${id}/delete`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.erro || "Failed to delete faculty");
  }
  return response.json();
}
