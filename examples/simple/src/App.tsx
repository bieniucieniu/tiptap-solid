import { A, Route, Router, type RouteSectionProps } from "@solidjs/router";
import type { Component } from "solid-js";
import { BasicEditor } from "./components/editors/Basic";
import { MarkdownEditor } from "./components/editors/Markdown";
import { MenusEditor } from "./components/editors/Menus";

// --- Main Layout ---

const Navigation = () => (
  <nav class="flex gap-2 mb-8 p-1 bg-muted rounded-xl border w-fit shadow-sm">
    <A
      href="/"
      end
      class="px-5 py-2.5 rounded-lg transition-all font-semibold text-sm flex items-center gap-2"
      activeClass="bg-white shadow-sm text-primary"
      inactiveClass="text-muted-foreground hover:text-foreground hover:bg-white/50"
    >
      Basic
    </A>
    <A
      href="/markdown"
      class="px-5 py-2.5 rounded-lg transition-all font-semibold text-sm flex items-center gap-2"
      activeClass="bg-white shadow-sm text-primary"
      inactiveClass="text-muted-foreground hover:text-foreground hover:bg-white/50"
    >
      Markdown
    </A>
    <A
      href="/menus"
      class="px-5 py-2.5 rounded-lg transition-all font-semibold text-sm flex items-center gap-2"
      activeClass="bg-white shadow-sm text-primary"
      inactiveClass="text-muted-foreground hover:text-foreground hover:bg-white/50"
    >
      Menus
    </A>
  </nav>
);

const App: Component<RouteSectionProps> = (props) => {
  return (
    <div class="max-w-5xl mx-auto py-16 px-6">
      <header class="mb-10 space-y-2">
        <h1 class="text-5xl font-black tracking-tight lg:text-6xl text-primary flex items-center gap-4">
          Tiptap{" "}
          <span class="bg-primary/10 text-primary/70 px-3 py-1 rounded-2xl text-3xl font-bold border border-primary/20">
            Solid
          </span>
        </h1>
      </header>

      <Navigation />

      <main class="min-h-125">{props.children}</main>
    </div>
  );
};

export default () => (
  <Router root={App}>
    <Route path="/" component={BasicEditor} />
    <Route path="/markdown" component={MarkdownEditor} />
    <Route path="/menus" component={MenusEditor} />
  </Router>
);
