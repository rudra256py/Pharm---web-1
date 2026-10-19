"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/lib/constants";

export default function RoleGuard({
  allow,
  children,
}: {
  allow?: Role[];
  children: ReactNode;
}) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <p className="py-16 text-center text-sm text-ink/60">Loading…</p>;
  }

  if (!user) {
    return (
      <div className="panel mx-auto max-w-md text-center">
        <h2 className="text-xl font-semibold">Log in to continue</h2>
        <p className="mt-2 text-sm text-ink/70">
          This page is only for registered members of the department.
        </p>
        <Link href="/login" className="btn-primary mt-4">
          Go to login
        </Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="panel mx-auto max-w-md text-center">
        <h2 className="text-xl font-semibold">Profile not found</h2>
        <p className="mt-2 text-sm text-ink/70">
          Your account has no profile yet. Log out, sign up again, or ask the
          department admin to check the database setup.
        </p>
      </div>
    );
  }

  if (allow && !allow.includes(profile.role)) {
    return (
      <div className="panel mx-auto max-w-md text-center">
        <h2 className="text-xl font-semibold">You don&apos;t have access to this page</h2>
        <p className="mt-2 text-sm text-ink/70">
          Your account role is not allowed here. Ask the department admin if you
          need a different role.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
