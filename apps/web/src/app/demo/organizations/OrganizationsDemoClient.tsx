"use client";

import React, { useState, useEffect } from "react";
import { RLink } from "../../../components/RLink";
import { routes } from "../../../lib/routes";

export default function OrganizationsDemoClient() {
  const [isClient, setIsClient] = useState(false);
  const [count, setCount] = useState(0);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Basic Dynamic Import Test</h1>
        <RLink to={routes.home} className="text-blue-600 hover:underline">
          ← Back to Home
        </RLink>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>

        <div className="space-y-4">
          <div>
            <strong>Client Side:</strong> {isClient ? "✅ Yes" : "❌ No"}
          </div>
          <div>
            <strong>Counter:</strong> {count}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setCount(count + 1)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Increment Counter
          </button>
        </div>

        {isClient && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-green-800 font-medium">✅ Success!</h3>
            <p className="text-green-700 text-sm mt-2">
              The basic dynamic import is working correctly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
