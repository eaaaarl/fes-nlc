import { loginAdminValues } from "@/lib/validation";

export async function adminLogin(payload: loginAdminValues) {
  const response = await fetch(`/api/auth/admin-login`, {
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
