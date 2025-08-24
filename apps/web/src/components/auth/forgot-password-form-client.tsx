"use client";

import { useState } from "react";
import { ForgotPasswordForm } from "./forgot-password-form";

export function ForgotPasswordFormClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/auth/forgot-password", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage(result.message);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form action={handleSubmit}>
        <ForgotPasswordForm />
      </form>
    </div>
  );
}
