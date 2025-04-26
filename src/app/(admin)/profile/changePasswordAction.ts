"use server";

import { z } from "zod";
import { changePassword } from "@/actions/auth";

// Validation schema for password change
const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(6, "The password is too short"),
});

// Handles password change request
export async function handleChangePassword(
  prevState: unknown,
  formData: FormData
) {
  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  // Validate input data
  const result = changePasswordSchema.safeParse({
    currentPassword,
    newPassword,
  });
  if (!result.success) {
    return {
      success: false,
      message: null,
      error: result.error.errors[0].message,
    };
  }

  // Attempt to change the password
  const errorChangePassword = await changePassword({
    info: { currentPassword, newPassword },
  });
  if (errorChangePassword) {
    return { success: false, message: null, error: errorChangePassword };
  }
  return {
    success: true,
    message: "Password Updated successully",
    error: null,
  };
}
