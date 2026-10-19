"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { AlumniProfile } from "@/lib/types";
import { disciplineLabel } from "@/lib/constants";

export default function AlumniPage() {
  const { profile } = useAuth();
  const [list, setList] = useState<AlumniProfile[] | null>(null);
  const [query, setQuery] = useState("");

  async function load() {
    const { data } = await supabase
      .from("alumni")
      .select("*")
      .order("batch", { ascending: false });
    setList((data as AlumniProfile[]) ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Remove this alumni profile?")) return;
    await supabase.from("alumni").delete().eq("id", id);
    load();
  }

  const q = query.trim().toLowerCase();
  const shown = (list ?? []).filter((a) =>
    !q
      ? true
      : [a.full_name, a.batch, a.organization, a.job_title, a.city]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
  );

  return (
    <>
      <PageHeader title="Alumni Registry" subtitle="Graduates of the department. Search by name, batch, workplace or city." />
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="w-full max-w-sm">
            <label htmlFor="q" className="label">Search alumni</label>
            <input id="q" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Name, batch, company, city" />
          </div>
          {(profile?.role === "alumni" || profile?.role === "admin") && (
            <Link href="/alumni/my-profile" className="btn-primary">
              {profile.role === "admin" ? "Add or edit my alumni profile" : "Create or edit my profile"}
            </Link>
          )}
        </div>

        {list === null && <p className="text-sm text-ink/60">Loading alumni…</p>}
        {list && shown.length === 0 && (
          <p className="panel text-sm text-ink/70">
            No alumni found. Graduating students can sign up as Alumni and add their profile.
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => (
            <article key={a.id} className="panel">
              <p className="text-xs font-medium text-brand">
                Batch {a.batch}
                {a.discipline ? ` · ${disciplineLabel(a.discipline)}` : ""}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{a.full_name}</h2>
              {(a.job_title || a.organization) && (
                <p className="text-sm text-ink/80">
                  {[a.job_title, a.organization].filter(Boolean).join(" at ")}
                </p>
              )}
              {a.city && <p className="text-sm text-ink/60">{a.city}</p>}
              {a.bio && <p className="mt-2 text-sm text-ink/75">{a.bio}</p>}
              <div className="mt-3 flex items-center gap-3">
                {a.linkedin && (
                  <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand underline">
                    LinkedIn
                  </a>
                )}
                {profile?.role === "admin" && (
                  <button className="btn-danger" onClick={() => remove(a.id)}>Remove</button>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
