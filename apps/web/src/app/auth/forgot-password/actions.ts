"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function forgotPasswordAction(
  prevState: {
    error: string | null;
    success: boolean;
    message: string | null;
    fieldErrors: Record<string, string[]>;
  },
  formData: FormData
) {
  const validatedFields = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid email address",
      success: false,
      message: null,
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    // TODO: Integrate with your auth service (NextAuth.js, custom, etc.)
    // Example with NextAuth.js:
    // await sendPasswordResetEmail(email);

    // For now, simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    revalidatePath("/auth/forgot-password");

    return {
      error: null,
      success: true,
      message: "Password reset link sent to your email",
      fieldErrors: {},
    };
  } catch (error) {
    return {
      error: "Failed to send reset link. Please try again.",
      success: false,
      message: null,
      fieldErrors: {},
    };
  }
}
