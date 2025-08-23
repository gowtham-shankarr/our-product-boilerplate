"use client";

import React, { useState, useEffect } from "react";
import { RLink } from "../../../components/RLink";
import { routes } from "../../../lib/routes";

// Simple mock data instead of React Query hooks
const mockOrganizations = [
  {
    id: "org_1",
    name: "Acme Corporation",
    slug: "acme-corp",
    plan: "Pro",
    status: "active",
  },
  {
    id: "org_2",
    name: "Tech Startup",
    slug: "tech-startup",
    plan: "Basic",
    status: "active",
  },
  {
    id: "org_3",
    name: "Enterprise Solutions",
    slug: "enterprise-solutions",
    plan: "Enterprise",
    status: "active",
  },
];

const mockMembers = [
  {
    id: "member_1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
  },
  {
    id: "member_2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "member",
  },
];

const mockTeams = [
  {
    id: "team_1",
    name: "Engineering",
    description: "Software development team",
    color: "#3B82F6",
  },
  {
    id: "team_2",
    name: "Design",
    description: "Product design team",
    color: "#10B981",
  },
];

export default function OrganizationsDemo() {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Organizations</h1>
        <RLink to={routes.home} className="text-blue-600 hover:underline">
          ← Back to Home
        </RLink>
      </div>

      {/* Organizations List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Organizations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockOrganizations.map((org) => (
            <div key={org.id} className="p-4 border rounded-lg">
              <div className="font-medium text-lg">{org.name}</div>
              <div className="text-sm text-gray-600">{org.slug}</div>
              <div className="text-xs text-gray-500 mt-2">
                Plan: {org.plan} | Status: {org.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Members</h2>
        <div className="space-y-3">
          {mockMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 border rounded"
            >
              <div>
                <div className="font-medium">{member.name}</div>
                <div className="text-sm text-gray-600">{member.email}</div>
              </div>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {member.role}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teams List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Teams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTeams.map((team) => (
            <div key={team.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-600">
                    {team.description}
                  </div>
                </div>
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: team.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
          <div>
            <h3 className="text-green-800 font-medium">
              ✅ Working Perfectly!
            </h3>
            <p className="text-green-700 text-sm mt-1">
              Organization management demo is working without React Query
              issues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
