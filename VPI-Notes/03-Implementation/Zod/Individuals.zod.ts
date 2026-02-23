import { z } from "zod";

export const individualSchema = z.object({
  fName: z.string().min(1, "First name is required"),
  mName: z.string().optional(),
  sName: z.string().min(1, "Surname is required"),
  eMail: z.string().email("Invalid email address"),
  mobile: z
    .string()
    .min(10, "Mobile must be at least 10 digits")
    .max(15, "Mobile must be at most 15 digits"),
  gender: z.enum(["Male", "Female", "Other"]),
  altMobile: z.string().optional(),
});

export type IndividualInput = z.infer<typeof individualSchema>;
