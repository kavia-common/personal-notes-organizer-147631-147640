import { component$, $, useStore, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

/**
 * Home Page: Notes list/search/new note entry
 */
const DUMMY_USER_ID = "demo-user";

interface Note {
  id: string;
  title: string;
  body: string;
  category: string;
  updated: string;
}

const CATEGORY_LIST = [
  { id: "all", name: "All" },
  { id: "personal", name: "Personal" },
  { id: "work", name: "Work" },
  { id: "ideas", name: "Ideas" },
  { id: "other", name: "Other" }
];

// PUBLIC_INTERFACE
export default component$(() => {
  const notesStore = useStore({
    notes: [] as Note[],
    filteredNotes: [] as Note[],
    query: "",
    category: "all",
    loading: true,
    error: "",
  });

  // Sidebar slot support
  const Sidebar = component$(() => {
    return (
      <nav>
        {CATEGORY_LIST.map((cat) => (
          <button
            type="button"
            class={`category${notesStore.category === cat.id ? " active" : ""}`}
            key={cat.id}
            onClick$={() => {
              notesStore.category = cat.id;
              filterNotes();
            }}
          >
            {cat.name}
          </button>
        ))}
      </nav>
    );
  });

  // Fetch notes from backend on mount (replace with actual fetch in production)
  useVisibleTask$(async () => {
    notesStore.loading = true;
    notesStore.error = "";
    try {
      // Fetch from backend API, replace URL with API endpoint, using env/process.env in real setup
      const resp = await fetch("/api/notes?user=" + DUMMY_USER_ID);
      if (resp.ok) {
        notesStore.notes = await resp.json();
      } else {
        notesStore.error = "Failed to load notes";
        notesStore.notes = [];
      }
    } catch (err) {
      notesStore.error = "Unable to connect to backend";
      notesStore.notes = [];
    }
    filterNotes();
    notesStore.loading = false;
  });

  // Filter notes by query/category
  const filterNotes = $(() => {
    notesStore.filteredNotes = notesStore.notes.filter((note) => {
      const matchesCat =
        notesStore.category === "all" || note.category === notesStore.category;
      const matchesQuery =
        !notesStore.query ||
        note.title.toLowerCase().includes(notesStore.query.toLowerCase()) ||
        note.body.toLowerCase().includes(notesStore.query.toLowerCase());
      return matchesCat && matchesQuery;
    });
  });

  // Search handler
  const onSearch = $((e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    notesStore.query = val;
    filterNotes();
  });

  return (
    <>
      {/* Sidebar slot used by layout */}
      <Sidebar q:slot="sidebar" />

      <div>
        <h1 class="main-title">My Notes</h1>
        <div class="notes-search-bar">
          <input
            type="search"
            placeholder="Search notes..."
            onInput$={onSearch}
            value={notesStore.query}
            aria-label="Search notes"
          />
          <a class="button accent" href="/new">+ New Note</a>
        </div>
        {notesStore.loading ? (
          <div>Loading...</div>
        ) : notesStore.error ? (
          <div style={{ color: "red" }}>{notesStore.error}</div>
        ) : (
          <div class="notes-list">
            {notesStore.filteredNotes.length === 0 ? (
              <div>No notes found.</div>
            ) : (
              notesStore.filteredNotes.map((note) => (
                <div class="note-card" key={note.id}>
                  <div class="note-title">{note.title}</div>
                  <div class="note-body">{note.body.slice(0, 120)}{note.body.length>120?"...":""}</div>
                  <div class="note-actions">
                    <a class="button" href={`/note/${note.id}`}>View</a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "My Notes",
  meta: [
    { name: "description", content: "Minimal notes app - home" },
  ],
};
