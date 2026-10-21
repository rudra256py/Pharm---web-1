"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/lib/constants";
import { site } from "@/data/site";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/academics", label: "Academics" },
  { href: "/faculty", label: "Faculty" },
  { href: "/notices", label: "Notices" },
  { href: "/lecture-notes", label: "Lecture Notes" },
  { href: "/gallery", label: "Gallery" },
  { href: "/alumni", label: "Alumni" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [...LINKS];
  if (profile && (profile.role === "uploader" || profile.role === "admin")) {
    links.push({ href: "/upload", label: "Upload" });
  }
  if (profile?.role === "admin") {
    links.push({ href: "/admin", label: "Admin" });
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-brand-tint text-brand-dark"
        : "text-ink/80 hover:bg-brand-tint hover:text-brand-dark"
    }`;

  async function handleLogout() {
    await signOut();
    setOpen(false);
    router.push("/");
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-md bg-brand font-serif text-lg font-bold text-white"
          >
            ℞
          </span>
          <span className="font-serif text-lg font-semibold text-brand-dark">
            {site.shortName}
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
          {loading ? null : user ? (
            <div className="ml-2 flex items-center gap-2 border-l border-ink/10 pl-3">
              <span className="text-xs text-ink/70">
                {profile?.full_name || user.email}
                {profile && (
                  <span className="ml-1 rounded bg-amber-soft px-1.5 py-0.5 font-medium text-ink">
                    {ROLE_LABELS[profile.role]}
                  </span>
                )}
              </span>
              <button onClick={handleLogout} className="btn-ghost !px-3 !py-1.5">
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary ml-2">
              Login
            </Link>
          )}
        </div>

        <button
          className="rounded-md border border-ink/20 px-3 py-2 text-sm font-medium lg:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-white px-4 pb-4 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={linkClass(l.href)}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="btn-ghost mt-2">
                Log out {profile ? `(${ROLE_LABELS[profile.role]})` : ""}
              </button>
            ) : (
              <Link href="/login" className="btn-primary mt-2" onClick={() => setOpen(false)}>
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
