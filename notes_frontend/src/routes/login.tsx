import { component$, useStore, $ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

// PUBLIC_INTERFACE
export default component$(() => {
  const s = useStore({ email: "", password: "", error: "", loading: false });

  const onLogin = $(async (e: Event) => {
    e.preventDefault();
    s.loading = true;
    s.error = "";
    // TODO: Call backend for real authentication
    setTimeout(() => {
      if (s.email && s.password) {
        // simulate login
        window.location.href = "/";
      } else {
        s.error = "Enter email and password";
      }
      s.loading = false;
    }, 700);
  });

  return (
    <div>
      <h2 class="main-title">Log In</h2>
      <form class="note-form" onSubmit$={onLogin}>
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
          placeholder="Password"
          required
          value={s.password}
          onInput$={(e) => (s.password = (e.target as HTMLInputElement).value)}
        />
        {s.error && <div style={{ color: "red" }}>{s.error}</div>}
        <button class="button accent" disabled={s.loading}>
          {s.loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <div style="margin-top:1rem;">
        <a href="/signup">Don't have an account? Sign up</a>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Login",
  meta: [
    { name: "description", content: "Login to your notes app" },
  ],
};
