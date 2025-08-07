import { component$, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const CATEGORY_LIST = [
  { id: "personal", name: "Personal" },
  { id: "work", name: "Work" },
  { id: "ideas", name: "Ideas" },
  { id: "other", name: "Other" }
];

// PUBLIC_INTERFACE
export default component$(() => {
  const s = useStore({
    title: "",
    body: "",
    category: "personal",
    error: "",
    created: false,
    loading: false,
  });

  // Submit handler: Calls backend to create a note
  const onAddNote = $(async (e: Event) => {
    e.preventDefault();
    s.loading = true;
    s.error = "";
    try {
      // The actual backend integration: replace /api/notes (and add proper env var)
      const resp = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: s.title,
          body: s.body,
          category: s.category,
        }),
      });
      if (resp.ok) {
        s.created = true;
      } else {
        s.error = "Failed to create note";
      }
    } catch (err) {
      s.error = "Server error creating note";
    }
    s.loading = false;
  });

  if (s.created) {
    return (
      <div>
        <h2 class="main-title">Note created!</h2>
        <div>
          <a href="/" class="button accent">Back to Notes</a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 class="main-title">New Note</h2>
      <form class="note-form" onSubmit$={onAddNote}>
        <input
          class="input"
          required
          maxLength={120}
          placeholder="Title"
          value={s.title}
          onInput$={(e) => (s.title = (e.target as HTMLInputElement).value)}
        />
        <textarea
          class="textarea"
          required
          maxLength={4000}
          placeholder="Write your note here..."
          value={s.body}
          onInput$={(e) => (s.body = (e.target as HTMLTextAreaElement).value)}
        />
        <div>
          <label>
            Category:{" "}
            <select
              class="input"
              value={s.category}
              onChange$={(e) =>
                (s.category = (e.target as HTMLSelectElement).value)
              }
            >
              {CATEGORY_LIST.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {s.error && <div style={{ color: "red" }}>{s.error}</div>}
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button class="button accent" disabled={s.loading || !s.title || !s.body}>
            {s.loading ? "Saving..." : "Add Note"}
          </button>
          <a href="/" class="button secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Create Note",
  meta: [
    { name: "description", content: "Add a new note" },
  ],
};
