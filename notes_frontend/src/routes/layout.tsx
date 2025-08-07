import { component$, Slot, useStore, useStyles$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import styles from "./styles.css?inline";

/**
 * App Shell Layout Component: Topnav, Sidebar, Main Content.
 */
export const onGet: RequestHandler = async ({ cacheControl }) => {
  cacheControl({
    staleWhileRevalidate: 60 * 60 * 24 * 7,
    maxAge: 5,
  });
};

// PUBLIC_INTERFACE
export default component$(() => {
  useStyles$(styles);

  // App-wide user/auth state, to be filled in
  const store = useStore({
    user: null as null | { id: string; name: string },
    // state management for sidebar/mobile, etc., could go here
  });

  return (
    <div class="app-root">
      <nav class="top-nav">
        <div class="nav-title">Notes App</div>
        <div class="nav-actions">
          {/* Auth: login/logout will be populated here */}
          {store.user ? (
            <span class="user-section">Hello, {store.user.name}</span>
          ) : (
            <a href="/login" class="nav-login-link">Login</a>
          )}
        </div>
      </nav>
      <main class="app-layout">
        <aside class="sidebar">
          {/* Category sidebar, implemented in per-page or as component */}
          <Slot name="sidebar" />
        </aside>
        <section class="main-content">
          <Slot />
        </section>
      </main>
    </div>
  );
});
