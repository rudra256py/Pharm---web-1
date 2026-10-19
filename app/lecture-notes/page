"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { LectureNote } from "@/lib/types";
import { DISCIPLINES, disciplineLabel, formatDate } from "@/lib/constants";

function NotesList() {
  const { profile } = useAuth();
  const [notes, setNotes] = useState<LectureNote[] | null>(null);
  const [query, setQuery] = useState("");
  const [disc, setDisc] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    // The database itself only returns notes this user is allowed to see.
    supabase
      .from("lecture_notes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setNotes((data as LectureNote[]) ?? []);
      });
  }, []);

  async function download(n: LectureNote) {
    setError("");
    const { data, error } = await supabase.storage
      .from("lecture-notes")
      .createSignedUrl(n.file_path, 120, { download: n.file_name });
    if (error || !data) {
      setError(error?.message ?? "Could not create the download link.");
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener");
  }

  const q = query.trim().toLowerCase();
  const shown = (notes ?? []).filter((n) => {
    if (disc !== "all" && n.discipline !== disc) return false;
    if (!q) return true;
    return [n.title, n.subject, n.uploader_name].some((v) => v?.toLowerCase().includes(q));
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <p className="mb-5 text-sm text-ink/70">
        Showing notes for <strong>{profile?.role === "admin" ? "all disciplines" : disciplineLabel(profile?.discipline ?? "")}</strong>.
      </p>
      <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_14rem]">
        <div>
          <label className="label" htmlFor="q">Search by title or subject</label>
          <input id="q" className="input" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        {profile?.role === "admin" && (
          <div>
            <label className="label" htmlFor="d">Discipline</label>
            <select id="d" className="input" value={disc} onChange={(e) => setDisc(e.target.value)}>
              <option value="all">All</option>
              {DISCIPLINES.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {notes === null && <p className="text-sm text-ink/60">Loading notes…</p>}
      {notes && shown.length === 0 && !error && (
        <p className="panel text-sm text-ink/70">No lecture notes found yet.</p>
      )}

      <div className="space-y-3">
        {shown.map((n) => (
          <article key={n.id} className="panel flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-brand-dark">{n.title}</h2>
              <p className="text-sm text-ink/70">
                {n.subject} · {disciplineLabel(n.discipline)}
              </p>
              <p className="text-xs text-ink/55">
                Uploaded by {n.uploader_name || "Faculty"} on {formatDate(n.created_at)}
              </p>
            </div>
            <button className="btn-primary" onClick={() => download(n)}>Download PDF</button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function LectureNotesPage() {
  return (
    <>
      <PageHeader title="Lecture Notes" subtitle="PDF notes for your programme, shared by class representatives and faculty." />
      <div className="px-0 py-2">
        <RoleGuard>
          <NotesList />
        </RoleGuard>
      </div>
    </>
  );
}
