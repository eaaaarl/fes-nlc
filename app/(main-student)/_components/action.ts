import { ChangePasswordValues } from "@/lib/validation";

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

export async function changePassword(payload: ChangePasswordValues) {
  const response = await fetch(`/api/student/auth/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to change password.");
  }

  return response.json();
}
