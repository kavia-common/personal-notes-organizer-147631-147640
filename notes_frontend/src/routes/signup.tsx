import { component$, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

// PUBLIC_INTERFACE
export default component$(() => {
  const s = useStore({
    email: "",
    password: "",
    error: "",
    loading: false,
    registered: false,
  });

  const onSignup = $(async (e: Event) => {
    e.preventDefault();
    s.loading = true;
    s.error = "";
    // TODO: Call backend API for user registration.
    setTimeout(() => {
      if (s.email && s.password) {
        s.registered = true;
      } else s.error = "Provide email and password";
      s.loading = false;
    }, 800);
  });

  if (s.registered)
    return (
      <div>
        <h2 class="main-title">Registration Complete</h2>
        <a href="/login" class="button accent">
          Proceed to Login
        </a>
      </div>
    );

  return (
    <div>
      <h2 class="main-title">Sign Up</h2>
      <form class="note-form" onSubmit$={onSignup}>
        <input
          class="input"
          type="email"
          placeholder="Email"
          required
          value={s.email}
          onInput$={(e) => (s.email = (e.target as HTMLInputElement).value)}
        />
        <input
          class="input"
          type="password"
          required
          minLength={6}
          placeholder="Password (6+ chars)"
          value={s.password}
          onInput$={(e) => (s.password = (e.target as HTMLInputElement).value)}
        />
        {s.error && <div style={{ color: "red" }}>{s.error}</div>}
        <button class="button accent" disabled={s.loading}>
          {s.loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
      <div style="margin-top:1rem;">
        <a href="/login">Already have an account? Login</a>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Signup",
  meta: [{ name: "description", content: "Signup for the notes app" }],
};
