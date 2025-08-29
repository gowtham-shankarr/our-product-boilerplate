"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useCSRF() {
  const { data: session } = useSession();
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      // Fetch CSRF token from server
      fetch("/api/csrf", {
        method: "GET",
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.token) {
            setCsrfToken(data.token);
          }
        })
        .catch((error) => {
          console.error("Failed to fetch CSRF token:", error);
        });
    }
  }, [session]);

  const getCSRFHeaders = () => {
    if (!csrfToken) return {};

    return {
      "x-csrf-token": csrfToken,
    };
  };

  return {
    csrfToken,
    getCSRFHeaders,
  };
}
