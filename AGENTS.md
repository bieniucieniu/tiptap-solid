# Project Basics

- Act only on request; minimize unnecessary builds/checks.
- No arbitrary fix scripts; never downgrade package versions.
- If in doubt, ask for clarification.

# Package Development: Solid

- Implementation reference: [Tiptap React](https://github.com/ueberdosis/tiptap/tree/main/packages/react)
- Tech Stack: SolidJS.

# SolidJS Style Guide

- **Props & State:** Never destructure component props (immutable getters). Use `splitProps` but omit `local` if only accessing properties directly. Hook returns (objects/arrays) must not be destructured unless they follow the `[state, setState]` pattern.
- **Reactivity:** Use `Accessor<T>` for data-fetching getters (`() => T`). Pass hook arguments as functions/accessors to maintain signal reactivity. Prefer `createMutable` for large objects; use `createStore` if needed.
- **Optimization:** Do not memoize simple operations (`a + b`, `a.b.c`) or raw functions; memoize only new objects or calls to prop-originated functions.
- **Refs:** Custom component refs must use `(el: HTMLElement | null) => void`. Define refs as `let ref: HTMLElement | undefined;` and assign via `ref={el => ref = el}` or `ref={ref}`.
- **Control Flow:** Use function children for `<Show>` state: `<Show when={state()}>{(v) => ...}</Show>`.

### Preferred `splitProps` Pattern:

```tsx
export function NodeViewWrapper(props: NodeViewWrapperProps) {
  const [, rest] = splitProps(props, ["as", "style", "ref"]);
  const nv = useSolidNodeView();
  return (
    <Dynamic
      component={props.as || "div"}
      {...rest}
      ref={props.ref}
      onDragStart={nv.onDragStart}
      style={{ "white-space": "normal", ...(typeof props.style === "object" ? props.style : {}) }}
    />
  );
}
```

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
