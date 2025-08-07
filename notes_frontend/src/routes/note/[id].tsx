import { component$, Resource, useStore, useResource$, $ } from '@builder.io/qwik';
import type { DocumentHead } from "@builder.io/qwik-city";

const CATEGORY_LIST = [
  { id: "personal", name: "Personal" },
  { id: "work", name: "Work" },
  { id: "ideas", name: "Ideas" },
  { id: "other", name: "Other" }
];

/**
 * Fetch note data from backend for given id.
 */
const fetchNote = async (id: string) => {
  const resp = await fetch(`/api/notes/${id}`);
  if (!resp.ok) throw new Error("Unable to fetch note");
  return resp.json();
};

 // PUBLIC_INTERFACE
export default component$((props: { params: { id: string } }) => {
  const store = useStore({
    edit: false,
    deleted: false,
    error: "",
    loading: false,
    note: null as any,
    saved: false,
  });

  // Fetch the current note for this id param
  const noteResource = useResource$<any>(async ({ track }) => {
    track(() => props.params.id);
    return await fetchNote(props.params.id);
  });

  // Submit edit changes handler
  const onSaveEdit = $(async (e: Event) => {
    e.preventDefault();
    store.loading = true;
    try {
      const resp = await fetch(`/api/notes/${props.params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: store.note.title,
          body: store.note.body,
          category: store.note.category,
        }),
      });
      if (!resp.ok) {
        store.error = "Edit failed";
        return;
      }
      store.saved = true;
      store.edit = false;
    } catch {
      store.error = "Server error editing";
    }
    store.loading = false;
  });

  // Delete handler
  const onDelete = $(async () => {
    if (!confirm("Delete this note permanently?")) return;
    store.loading = true;
    try {
      const resp = await fetch(`/api/notes/${props.params.id}`, { method: "DELETE" });
      if (!resp.ok) {
        store.error = "Failed to delete";
        return;
      }
      store.deleted = true;
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch {
      store.error = "Error deleting";
    }
    store.loading = false;
  });

  return (
    <Resource
      value={noteResource}
      onPending={() => <div>Loading note...</div>}
      onRejected={(err) => <div style="color:red;">{store.error || String(err)}</div>}
      onResolved={(note) => {
        if (!store.note) store.note = { ...note };
        if (store.deleted) return <div>Note deleted.</div>;
        if (store.edit) {
          return (
            <div>
              <h2 class="main-title">Edit Note</h2>
              <form class="note-form" onSubmit$={onSaveEdit}>
                <input
                  class="input"
                  required
                  maxLength={120}
                  value={store.note.title}
                  onInput$={(e) => (store.note.title = (e.target as HTMLInputElement).value)}
                />
                <textarea
                  class="textarea"
                  required
                  maxLength={4000}
                  value={store.note.body}
                  onInput$={(e) => (store.note.body = (e.target as HTMLTextAreaElement).value)}
                />
                <label>
                  Category:{" "}
                  <select
                    class="input"
                    value={store.note.category}
                    onChange$={(e) => (store.note.category = (e.target as HTMLSelectElement).value)}
                  >
                    {CATEGORY_LIST.map((cat) => (
                      <option value={cat.id} key={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </label>
                {store.error && <div style="color:red;">{store.error}</div>}
                <div style="display:flex;gap:1rem;margin-top:1rem">
                  <button class="button accent" disabled={store.loading}>
                    {store.loading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    class="button secondary"
                    disabled={store.loading}
                    onClick$={() => (store.edit = false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          );
        }
        return (
          <div>
            <h2 class="main-title">{note.title}</h2>
            <div style="margin-bottom:1rem;color:#666">
              <b>Category:</b> {note.category}
              <span style="margin-left:1.4rem"><b>Last updated:</b> {note.updated?.slice(0, 19).replace("T", " ")}</span>
            </div>
            <div class="note-body" style="margin-bottom:2rem">{note.body}</div>
            {store.error && <div style="color:red;">{store.error}</div>}
            <div class="note-actions">
              <button class="button accent" onClick$={() => (store.edit = true)}>Edit</button>
              <button class="button secondary" onClick$={onDelete} disabled={store.loading}>Delete</button>
              <a href="/" class="button">Back</a>
            </div>
            {store.saved && <div style="color:green;margin-top:1rem">Note updated!</div>}
          </div>
        );
      }}
    />
  );
});

export const head: DocumentHead = {
  title: "Note Details",
  meta: [
    { name: "description", content: "View and edit note" },
  ],
};
