import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),

  NODE_ENV: z.enum(["development", "production"]).default("development"),

  ADMIN_USER: z.string().min(3, "Username must be at least 3 characters"),
  ADMIN_PASS: z.string().min(8, "Password must be at least 8 characters"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment configuration:", parsedEnv.error.errors);
  throw new Error("Invalid environment configuration");
}

export const env = parsedEnv.data;
