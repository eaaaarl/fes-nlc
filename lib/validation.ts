import { z } from "zod";

export const facultySchema = z.object({
  facultyName: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  department: z.string().min(1, "Department is required"),
  subjectIds: z
    .array(z.string())
    .min(1, "At least one subject must be selected"),
});

export type facultyValues = z.infer<typeof facultySchema>;

export const studentSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  department: z.string().min(1, "Department is required"),
  subjectIds: z
    .array(z.string())
    .min(1, "At least one subject must be selected"),
});

export type studentValues = z.infer<typeof studentSchema>;

export const studentEditSchema = z.object({
  fullName: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  department: z.string().min(1, "Department is required"),
  subjectIds: z
    .array(z.string())
    .min(1, "At least one subject must be selected"),
});

export type studentEditValues = z.infer<typeof studentEditSchema>;

export const evaluationSchema = z.object({
  facultyId: z.string().min(1, "Faculty Id is required"),
  subject: z.string().min(1, "Subject is required"),
  classSchedule: z.string().min(1, "Class Schedule is required"),
  response: z.record(z.string(), z.number().int().min(1).max(5)),
  comments: z.string().optional(),
});

export type evaluationValues = z.infer<typeof evaluationSchema>;

export const loginStudentSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(100, "Username cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "username can only contain letters, spaces, hyphens, and apostrophes"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters"),
});

export type loginStudentValues = z.infer<typeof loginStudentSchema>;

export const loginAdminSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(100, "Username cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "username can only contain letters, spaces, hyphens, and apostrophes"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(128, "Password cannot exceed 128 characters"),
});

export type loginAdminValues = z.infer<typeof loginAdminSchema>;
