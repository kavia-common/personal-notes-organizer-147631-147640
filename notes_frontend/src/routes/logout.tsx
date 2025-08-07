import { component$, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

// PUBLIC_INTERFACE
export default component$(() => {
  useVisibleTask$(() => {
    // Remove auth tokens, perform backend logout action if needed
    setTimeout(() => {
      window.location.href = "/login";
    }, 800);
  });

  return <div>Logging out...</div>;
});

export const head: DocumentHead = {
  title: "Logout",
};
