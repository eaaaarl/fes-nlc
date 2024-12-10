export async function logoutStudent() {
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
}
