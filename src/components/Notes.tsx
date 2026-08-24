import { useEffect, useState } from "react";
import { supabase, type Note } from "../lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

export default function Notes({ session }: { session: Session }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setNotes(data as Note[]);
    setLoading(false);
  }

  async function addNote(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const { error } = await supabase.from("notes").insert({
      title,
      body,
      user_id: session.user.id,
    });
    if (!error) {
      setTitle("");
      setBody("");
      fetchNotes();
    }
  }

  async function deleteNote(id: string) {
    await supabase.from("notes").delete().eq("id", id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="min-h-screen max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-baseline justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-moss mb-1">
            Field Notes
          </p>
          <h1 className="font-display text-3xl">Your notes</h1>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-ink/50 hover:text-clay"
        >
          Sign out
        </button>
      </div>

      <form onSubmit={addNote} className="mb-12 border border-line bg-white p-5 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full text-lg font-display outline-none placeholder:text-ink/30"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write something..."
          rows={3}
          className="w-full text-sm outline-none placeholder:text-ink/30 resize-none"
        />
        <button
          type="submit"
          className="bg-ink text-paper text-sm px-4 py-2 hover:bg-moss transition-colors"
        >
          Save note
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-ink/40">Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-sm text-ink/40">
          Nothing here yet. Your first note starts the page.
        </p>
      ) : (
        <ul className="space-y-4">
          {notes.map((note) => (
            <li key={note.id} className="border-l-2 border-line pl-4 group">
              <div className="flex items-start justify-between">
                <h3 className="font-display text-lg">{note.title}</h3>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-xs text-ink/30 opacity-0 group-hover:opacity-100 hover:text-clay transition-opacity"
                >
                  Delete
                </button>
              </div>
              {note.body && (
                <p className="text-sm text-ink/70 mt-1">{note.body}</p>
              )}
              <p className="text-xs text-ink/30 mt-1">
                {new Date(note.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
