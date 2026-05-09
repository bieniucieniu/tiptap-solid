# basics
- don't do sutff unlessed asked
- don't run checks or builds on your own unless it's neccessary or asked
- don't create or run arbitrary scripts for fixes
- never drop package version to fix issue
- ask questions as needed (if you don't know the answer, ask)


# @/packages
    - solid
        - take example from https://github.com/ueberdosis/tiptap/tree/main/packages/react
        - use solidjs


# solid js style guide
- never destructure Component props
- if hook returns a object or array, it should never be destructured unless it's function like `const [state, setState] = createState(...)` or similar
- when splitting props into local and rest, use `splitProps` from solid-js, if local are not passed as whole object to any function and it used only with explicit property access it shuold be omitted and just use props object
always this
```ts
export function NodeViewWrapper(props: NodeViewWrapperProps) {
  const [, rest] = splitProps(props, ["as", "style", "ref"]);
  const { onDragStart } = useSolidNodeView();

  return (
    <Dynamic
      component={props.as || "div"}
      {...rest}
      ref={props.ref}
      data-node-view-wrapper=""
      onDragStart={onDragStart}
      style={{
        "white-space": "normal",
        ...(typeof props.style === "object" ? props.style : {}),
      }}
    />
  );
}``` 
over 
```ts
export function NodeViewWrapper(props: NodeViewWrapperProps) {
  const [local, rest] = splitProps(props, ["as", "style", "ref"]);
  const { onDragStart } = useSolidNodeView();

  return (
    <Dynamic
      component={local.as || "div"}
      {...rest}
      ref={local.ref}
      data-node-view-wrapper=""
      onDragStart={onDragStart}
      style={{
        "white-space": "normal",
        ...(typeof local.style === "object" ? local.style : {}),
      }}
    />
  );
}
```
- arguments of signature `() => T` with no arguments whose solo purpose is to get some data should be replaced with `Accessor<T>` from solid-js
- solid depends on passing arguments to hooks as functions or something with getters because of the nature of signals
    - if you are creating a hook which accepts arguments, they should be functions or accessors
- if you are dealing with large objects use `createMutable` or `createStore`, prefer `createMutable`
- don't memoize functions
- don't memoize simple operations like `a + b` or `a.b.c.d`; just create a function to do so unless it creates a new object or calls a function originating from props
- never set component props; they are immutable objects with only getters
- custom component refs should only have the signature `(el: HTMLElement | null) => void`
- in components, a ref should be defined by `let ref: HTMLElement | undefined;` and should be set by `ref={el => ref = el}` or `ref={ref}`
- when using `<Show when={...}>` valid state suild be consumed as function children like `<Show when={...}>{(state) => ...}</Show>`
