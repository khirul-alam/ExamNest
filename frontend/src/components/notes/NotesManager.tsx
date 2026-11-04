// frontend/src/components/notes/NotesManager.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Search, StickyNote, Trash2 } from "lucide-react";
import { formatBanglaDate } from "@/lib/format";
import {
  NOTE_BODY_MAX,
  NOTE_TITLE_MAX,
  createNote,
  loadNotes,
  saveNotes,
  toLocalIsoDate,
  type Note,
} from "@/lib/notes";
import { toBanglaNumber } from "@/lib/pricing";
import { allSubjects } from "@/lib/subjects-data";

// নোটের সাথে জুড়ে দেওয়ার জন্য টপিকের তালিকা
const topicOptions = allSubjects.flatMap((subject) =>
  subject.chapters.flatMap((chapter) =>
    chapter.topics.map((topic) => ({
      key: `${subject.slug}/${topic.slug}`,
      label: `${subject.name} — ${topic.name}`,
    })),
  ),
);

export function NotesManager() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [ready, setReady] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topicKey, setTopicKey] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // পেজ খুললে ব্রাউজার থেকে নোট পড়া
  useEffect(() => {
    setNotes(loadNotes());
    setReady(true);
  }, []);

  // নোট বদলালেই সংরক্ষণ (পড়া শেষ হওয়ার আগে নয়, নইলে পুরনো নোট মুছে যেত)
  useEffect(() => {
    if (ready) saveNotes(notes);
  }, [notes, ready]);

  const resetForm = () => {
    setTitle("");
    setBody("");
    setTopicKey("");
    setEditingId(null);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();

    if (!cleanTitle) return setError("নোটের শিরোনাম লিখুন");
    if (cleanTitle.length > NOTE_TITLE_MAX) {
      return setError(`শিরোনাম ${toBanglaNumber(NOTE_TITLE_MAX)} অক্ষরের বেশি হতে পারবে না`);
    }
    if (!cleanBody) return setError("নোটের বিষয়বস্তু লিখুন");
    if (cleanBody.length > NOTE_BODY_MAX) {
      return setError(`বিষয়বস্তু ${toBanglaNumber(NOTE_BODY_MAX)} অক্ষরের বেশি হতে পারবে না`);
    }

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? { ...n, title: cleanTitle, body: cleanBody, topicKey, updatedAt: Date.now() }
            : n,
        ),
      );
    } else {
      setNotes((prev) => [createNote({ title: cleanTitle, body: cleanBody, topicKey }), ...prev]);
    }
    resetForm();
  };

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setBody(note.body);
    setTopicKey(note.topicKey);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // মুছতে দুবার চাপতে হয় (ভুল করে মোছা ঠেকাতে)
  const handleDelete = (id: string) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setConfirmDeleteId(null);
    if (editingId === id) resetForm();
  };

  const visibleNotes = useMemo(() => {
    const term = search.trim().toLowerCase();
    return [...notes]
      .filter((n) => !term || `${n.title} ${n.body}`.toLowerCase().includes(term))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [notes, search]);

  const topicLabel = (key: string) => topicOptions.find((o) => o.key === key)?.label;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <StickyNote size={22} className="text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold">আমার নোট</h1>
          <p className="text-sm text-muted-foreground">
            পড়ার সময় গুরুত্বপূর্ণ পয়েন্ট লিখে রাখুন
          </p>
        </div>
      </div>

      <p className="mb-4 rounded-lg border border-accent/40 bg-accent/10 px-3 py-2 text-xs">
        নোটগুলো এখন শুধু এই ব্রাউজারে সংরক্ষিত হচ্ছে। ব্যাকএন্ড যুক্ত হলে আপনার অ্যাকাউন্টে থাকবে।
      </p>

      {/* নোট লেখার ফর্ম */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mb-8 space-y-3 rounded-xl border border-border bg-card p-4"
      >
        <h2 className="text-sm font-semibold">{editingId ? "নোট সম্পাদনা" : "নতুন নোট"}</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="শিরোনাম"
          aria-label="নোটের শিরোনাম"
          maxLength={NOTE_TITLE_MAX}
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
        />

        <select
          value={topicKey}
          onChange={(e) => setTopicKey(e.target.value)}
          aria-label="সংশ্লিষ্ট টপিক"
          className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">কোনো টপিকের সাথে যুক্ত নয়</option>
          {topicOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        <div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            placeholder="নোট লিখুন..."
            aria-label="নোটের বিষয়বস্তু"
            maxLength={NOTE_BODY_MAX}
            className="w-full resize-y rounded-lg border border-border bg-muted px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <p className="mt-1 text-right font-mono text-xs text-muted-foreground">
            {toBanglaNumber(body.length)}/{toBanglaNumber(NOTE_BODY_MAX)}
          </p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            {editingId ? "হালনাগাদ করুন" : "নোট সংরক্ষণ করুন"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-border px-5 py-2 text-sm"
            >
              বাতিল
            </button>
          )}
        </div>
      </form>

      {/* নোটের তালিকা */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">সব নোট ({toBanglaNumber(notes.length)})</h2>
        <div className="relative w-full max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নোট খুঁজুন..."
            aria-label="নোট খুঁজুন"
            className="w-full rounded-lg border border-border bg-muted py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {!ready ? null : visibleNotes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
          {notes.length === 0 ? "এখনও কোনো নোট লেখা হয়নি।" : "কোনো নোট পাওয়া যায়নি।"}
        </div>
      ) : (
        <ul className="space-y-3">
          {visibleNotes.map((note) => {
            const label = topicLabel(note.topicKey);
            return (
              <li key={note.id} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{note.title}</h3>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => startEdit(note)}
                      aria-label="সম্পাদনা"
                      className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(note.id)}
                      aria-label="মুছুন"
                      className={`flex items-center gap-1 rounded p-1.5 text-xs hover:bg-muted ${
                        confirmDeleteId === note.id ? "text-red-600" : "text-muted-foreground"
                      }`}
                    >
                      <Trash2 size={14} />
                      {confirmDeleteId === note.id && "নিশ্চিত?"}
                    </button>
                  </div>
                </div>

                <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {note.body}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted-foreground">
                  <span>{formatBanglaDate(toLocalIsoDate(note.updatedAt))}</span>
                  {label && (
                    <Link
                      href={`/subjects/${note.topicKey}`}
                      className="font-sans text-primary hover:underline"
                    >
                      📌 {label}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}