import type { Editor } from "@tiptap/core";
import type { JSX } from "solid-js";
import { type Accessor, createContext, useContext } from "solid-js";
import { EditorContext } from "./Context";
import { EditorContent, type EditorContentProps } from "./EditorContent";
import { type EditorStateSnapshot, useEditorState } from "./useEditorState";

/**
 * The shape of the Solid context used by the `<Tiptap />` components.
 */
export type TiptapContextType = {
  /** The Tiptap editor instance. */
  get editor(): Editor;
};

/**
 * Solid context that stores the current editor instance.
 */
export const TiptapContext = createContext<TiptapContextType>({
  get editor(): Editor {
    throw new Error("useTiptap must be used within a <Tiptap> provider");
  },
});

/**
 * Hook to read the Tiptap context and access the editor instance.
 */
export const useTiptap = () => useContext(TiptapContext);

export const useTiptapEditor = (
  e?: Accessor<Editor | null>,
): Accessor<Editor | null> => {
  const ctx = useTiptap();
  return () => e?.() || ctx.editor;
};

/**
 * Options for the `useTiptapState` hook.
 */
export type UseTiptapStateOptions<TSelectorResult> = {
  /**
   * The editor instance. If not provided, it will use the editor from the Tiptap context.
   */
  editor?: Accessor<Editor | null>;
  /**
   * A selector function to determine the value to compare for re-rendering.
   */
  selector: (context: EditorStateSnapshot<Editor | null>) => TSelectorResult;
  /**
   * A custom equality function to determine if the component should re-render.
   */
  equalityFn?: (a: TSelectorResult, b: TSelectorResult | null) => boolean;
};

/**
 * Select a slice of the editor state using the context-provided editor.
 */
export function useTiptapState<TSelectorResult>(
  options: UseTiptapStateOptions<TSelectorResult>,
) {
  const ctx = useTiptap();
  const editor = () => options.editor?.() || ctx.editor;

  return useEditorState<TSelectorResult>({
    editor,
    selector: options.selector,
    equalityFn: options.equalityFn,
  });
}

/**
 * Props for the `Tiptap` root/provider component.
 */
export type TiptapWrapperProps = {
  editor: Accessor<Editor | null>;
  children: JSX.Element;
};

/**
 * Top-level provider component.
 */
export function TiptapWrapper(props: TiptapWrapperProps) {
  const tiptapContextValue = {
    get editor() {
      const e = props.editor();
      if (!e) throw new Error("Tiptap: An editor instance is required.");
      return e;
    },
  };

  const legacyContextValue = {
    editor: props.editor,
  };

  return (
    <EditorContext.Provider value={legacyContextValue}>
      <TiptapContext.Provider value={tiptapContextValue}>
        {props.children}
      </TiptapContext.Provider>
    </EditorContext.Provider>
  );
}

/**
 * Convenience component that renders `EditorContent`.
 */
export function TiptapContent(props: Omit<EditorContentProps, "editor">) {
  const ctx = useTiptap();

  return <EditorContent editor={ctx.editor} {...props} />;
}

/**
 * Root `Tiptap` component.
 */
export const Tiptap = Object.assign(TiptapWrapper, {
  Content: TiptapContent,
});

export default Tiptap;
