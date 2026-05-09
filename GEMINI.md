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
