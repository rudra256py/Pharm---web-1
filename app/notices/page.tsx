"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";
import type { Notice } from "@/lib/types";
import { DISCIPLINES, disciplineLabel, formatDate } from "@/lib/constants";

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    supabase
      .from("notices")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setNotices((data as Notice[]) ?? []);
      });
  }, []);

  const shown = (notices ?? []).filter(
    (n) => filter === "all" || n.discipline === filter || n.discipline === "all"
  );

  return (
    <>
      <PageHeader title="Notices" subtitle="Announcements from the department. Newest first." />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 max-w-xs">
          <label htmlFor="disc" className="label">Show notices for</label>
          <select id="disc" className="input" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All disciplines</option>
            {DISCIPLINES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>

        {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">Could not load notices: {error}</p>}
        {notices === null && <p className="text-sm text-ink/60">Loading notices…</p>}
        {notices && shown.length === 0 && !error && (
          <p className="panel text-sm text-ink/70">No notices for this selection yet.</p>
        )}

        <div className="space-y-4">
          {shown.map((n) => (
            <article key={n.id} className="panel border-l-4 border-l-amber">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-semibold text-brand-dark">{n.title}</h2>
                <span className="rounded bg-brand-tint px-2 py-0.5 text-xs font-medium text-brand-dark">
                  {disciplineLabel(n.discipline)}
                </span>
              </div>
              <p className="mt-2 whitespace-pre-line text-sm text-ink/80">{n.body}</p>
              <p className="mt-3 text-xs text-ink/60">
                Posted by {n.author_name || "Department"} on {formatDate(n.created_at)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
