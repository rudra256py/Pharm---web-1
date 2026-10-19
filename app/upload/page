"use client";

import { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import RoleGuard from "@/components/RoleGuard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import type { LectureNote, Notice } from "@/lib/types";
import { DISCIPLINES, MAX_PDF_MB, disciplineLabel, formatDate, safeFileName } from "@/lib/constants";

type Msg = { ok: boolean; text: string } | null;

function Feedback({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <p className={`rounded-md p-3 text-sm ${msg.ok ? "bg-brand-tint text-brand-dark" : "bg-red-50 text-red-700"}`}>
      {msg.text}
    </p>
  );
}

function UploadTools() {
  const { user, profile } = useAuth();
  const isAdmin = profile?.role === "admin";
  const ownDisc = profile?.discipline ?? "dpharm";

  // Notice form
  const [nTitle, setNTitle] = useState("");
  const [nBody, setNBody] = useState("");
  const [nDisc, setNDisc] = useState(ownDisc);
  const [nBusy, setNBusy] = useState(false);
  const [nMsg, setNMsg] = useState<Msg>(null);

  // Lecture note form
  const [lTitle, setLTitle] = useState("");
  const [lSubject, setLSubject] = useState("");
  const [lDisc, setLDisc] = useState(ownDisc);
  const [lFile, setLFile] = useState<File | null>(null);
  const [lBusy, setLBusy] = useState(false);
  const [lMsg, setLMsg] = useState<Msg>(null);

  // My uploads
  const [myNotices, setMyNotices] = useState<Notice[]>([]);
  const [myNotes, setMyNotes] = useState<LectureNote[]>([]);

  const loadMine = useCallback(async () => {
    if (!user) return;
    const [a, b] = await Promise.all([
      supabase.from("notices").select("*").eq("author_id", user.id).order("created_at", { ascending: false }),
      supabase.from("lecture_notes").select("*").eq("uploader_id", user.id).order("created_at", { ascending: false }),
    ]);
    setMyNotices((a.data as Notice[]) ?? []);
    setMyNotes((b.data as LectureNote[]) ?? []);
  }, [user]);

  useEffect(() => {
    loadMine();
  }, [loadMine]);

  async function postNotice(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    setNBusy(true);
    setNMsg(null);
    const { error } = await supabase.from("notices").insert({
      title: nTitle.trim(),
      body: nBody.trim(),
      discipline: isAdmin ? nDisc : ownDisc,
      author_id: user.id,
      author_name: profile.full_name,
    });
    setNBusy(false);
    if (error) return setNMsg({ ok: false, text: error.message });
    setNMsg({ ok: true, text: "Notice published." });
    setNTitle("");
    setNBody("");
    loadMine();
  }

  async function uploadNote(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !profile) return;
    if (!lFile) return setLMsg({ ok: false, text: "Choose a PDF file first." });
    if (lFile.type !== "application/pdf") return setLMsg({ ok: false, text: "Only PDF files are allowed." });
    if (lFile.size > MAX_PDF_MB * 1024 * 1024) return setLMsg({ ok: false, text: `File is larger than ${MAX_PDF_MB} MB.` });

    setLBusy(true);
    setLMsg(null);
    const discipline = isAdmin ? lDisc : ownDisc;
    const path = `${discipline}/${Date.now()}-${safeFileName(lFile.name)}`;

    const up = await supabase.storage.from("lecture-notes").upload(path, lFile, {
      contentType: "application/pdf",
    });
    if (up.error) {
      setLBusy(false);
      return setLMsg({ ok: false, text: up.error.message });
    }
    const ins = await supabase.from("lecture_notes").insert({
      title: lTitle.trim(),
      subject: lSubject.trim(),
      discipline,
      file_path: path,
      file_name: lFile.name,
      uploader_id: user.id,
      uploader_name: profile.full_name,
    });
    setLBusy(false);
    if (ins.error) {
      await supabase.storage.from("lecture-notes").remove([path]);
      return setLMsg({ ok: false, text: ins.error.message });
    }
    setLMsg({ ok: true, text: "Lecture note uploaded." });
    setLTitle("");
    setLSubject("");
    setLFile(null);
    const pdfInput = document.getElementById("pdf") as HTMLInputElement | null;
    if (pdfInput) pdfInput.value = "";
    loadMine();
  }

  async function deleteNotice(id: string) {
    if (!confirm("Delete this notice?")) return;
    await supabase.from("notices").delete().eq("id", id);
    loadMine();
  }

  async function deleteNote(n: LectureNote) {
    if (!confirm("Delete this lecture note?")) return;
    await supabase.storage.from("lecture-notes").remove([n.file_path]);
    await supabase.from("lecture_notes").delete().eq("id", n.id);
    loadMine();
  }

  const discOptions = isAdmin ? DISCIPLINES : DISCIPLINES.filter((d) => d.value === ownDisc);

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={postNotice} className="panel space-y-4">
          <h2 className="text-xl font-semibold text-brand-dark">Post a notice</h2>
          <div>
            <label className="label" htmlFor="nt">Title</label>
            <input id="nt" required className="input" value={nTitle} onChange={(e) => setNTitle(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="nb">Notice text</label>
            <textarea id="nb" required rows={5} className="input" value={nBody} onChange={(e) => setNBody(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="nd">For</label>
            {isAdmin ? (
              <select id="nd" className="input" value={nDisc} onChange={(e) => setNDisc(e.target.value)}>
                <option value="all">All disciplines</option>
                {DISCIPLINES.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            ) : (
              <input id="nd" className="input" disabled value={disciplineLabel(ownDisc)} />
            )}
          </div>
          <Feedback msg={nMsg} />
          <button className="btn-primary" disabled={nBusy}>{nBusy ? "Publishing…" : "Publish notice"}</button>
        </form>

        <form onSubmit={uploadNote} className="panel space-y-4">
          <h2 className="text-xl font-semibold text-brand-dark">Upload a lecture note (PDF)</h2>
          <div>
            <label className="label" htmlFor="lt">Title</label>
            <input id="lt" required className="input" value={lTitle} onChange={(e) => setLTitle(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ls">Subject</label>
            <input id="ls" required className="input" placeholder="e.g. Pharmacology" value={lSubject} onChange={(e) => setLSubject(e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="ld">Programme</label>
            <select id="ld" className="input" value={isAdmin ? lDisc : ownDisc} disabled={!isAdmin} onChange={(e) => setLDisc(e.target.value)}>
              {discOptions.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="pdf">PDF file (max {MAX_PDF_MB} MB)</label>
            <input id="pdf" type="file" accept="application/pdf" className="input" onChange={(e) => setLFile(e.target.files?.[0] ?? null)} />
          </div>
          <Feedback msg={lMsg} />
          <button className="btn-primary" disabled={lBusy}>{lBusy ? "Uploading…" : "Upload note"}</button>
        </form>
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold text-brand-dark">My uploads</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="panel">
            <h3 className="mb-2 font-semibold">Notices</h3>
            {myNotices.length === 0 && <p className="text-sm text-ink/60">Nothing posted yet.</p>}
            <ul className="divide-y divide-ink/10">
              {myNotices.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span>{n.title} <span className="text-xs text-ink/55">({formatDate(n.created_at)})</span></span>
                  <button className="btn-danger" onClick={() => deleteNotice(n.id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="panel">
            <h3 className="mb-2 font-semibold">Lecture notes</h3>
            {myNotes.length === 0 && <p className="text-sm text-ink/60">Nothing uploaded yet.</p>}
            <ul className="divide-y divide-ink/10">
              {myNotes.map((n) => (
                <li key={n.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                  <span>{n.title} <span className="text-xs text-ink/55">({disciplineLabel(n.discipline)})</span></span>
                  <button className="btn-danger" onClick={() => deleteNote(n)}>Delete</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function UploadPage() {
  return (
    <>
      <PageHeader title="Upload" subtitle="Post notices and upload lecture notes for your programme." />
      <RoleGuard allow={["uploader", "admin"]}>
        <UploadTools />
      </RoleGuard>
    </>
  );
}
