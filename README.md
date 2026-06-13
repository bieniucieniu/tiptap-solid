# tiptap-solid

SolidJS bindings for [Tiptap](https://tiptap.dev). API and patterns follow [`@tiptap/react`](https://tiptap.dev/docs/editor/getting-started/install/react).

## Install

Not published to npm yet - install from GitHub with peer dependencies:

```bash
bun add github:bieniucieniu/tiptap-solid @tiptap/core @tiptap/pm @tiptap/starter-kit solid-js
```

npm / pnpm:

```bash
npm install github:bieniucieniu/tiptap-solid @tiptap/core @tiptap/pm @tiptap/starter-kit solid-js
pnpm add github:bieniucieniu/tiptap-solid @tiptap/core @tiptap/pm @tiptap/starter-kit solid-js
```

`dist/` is built automatically on install via the `prepare` script. Use aligned `@tiptap/*` versions (≥ 3.23.5).

For bubble/floating menus, also install the extensions and import from `tiptap-solid/menus`:

```bash
bun add @tiptap/extension-bubble-menu @tiptap/extension-floating-menu
```

## Usage

```tsx
import StarterKit from "@tiptap/starter-kit";
import { Tiptap, useEditor } from "tiptap-solid";

export function Editor() {
  const editor = useEditor(() => ({
    extensions: [StarterKit],
    content: "<p>Hello world</p>",
  }));

  return (
    <Tiptap editor={editor}>
      <Tiptap.Content />
    </Tiptap>
  );
}
```

## Exports

| Import | Description |
|---|---|
| `tiptap-solid` | `Tiptap`, `useEditor`, `useTiptapState`, `EditorContent`, … |
| `tiptap-solid/menus` | `BubbleMenu`, `FloatingMenu` |
| `tiptap-solid/node-view` | Custom node view helpers |

## Development

```bash
bun install
bun run build
cd examples/simple && bun run dev
```
