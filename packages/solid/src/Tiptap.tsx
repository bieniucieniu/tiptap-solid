import type { Editor } from "@tiptap/core";
import type { JSX } from "solid-js";
import { createContext, useContext } from "solid-js";
import { EditorContext } from "./Context";
import { EditorContent, type EditorContentProps } from "./EditorContent";
import { type EditorStateSnapshot, useEditorState } from "./useEditorState";

/**
 * The shape of the Solid context used by the `<Tiptap />` components.
 */
export type TiptapContextType = {
  /** The Tiptap editor instance. */
  editor: () => Editor;
};

/**
 * Solid context that stores the current editor instance.
 */
export const TiptapContext = createContext<TiptapContextType>({
  get editor(): () => Editor {
    throw new Error("useTiptap must be used within a <Tiptap> provider");
  },
});

/**
 * Hook to read the Tiptap context and access the editor instance.
 */
export const useTiptap = () => useContext(TiptapContext);

/**
 * Select a slice of the editor state using the context-provided editor.
 */
export function useTiptapState<TSelectorResult>(
  selector: (context: EditorStateSnapshot<Editor | null>) => TSelectorResult,
  equalityFn?: (a: TSelectorResult, b: TSelectorResult | null) => boolean,
) {
  const { editor } = useTiptap();

  return useEditorState<TSelectorResult>({
    editor,
    selector,
    equalityFn,
  });
}

/**
 * Props for the `Tiptap` root/provider component.
 */
export type TiptapWrapperProps = {
  editor: () => Editor | null;
  children: JSX.Element;
};

/**
 * Top-level provider component.
 */
export function TiptapWrapper(props: TiptapWrapperProps) {
  const tiptapContextValue = {
    editor: () => {
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
  const { editor } = useTiptap();

  return <EditorContent editor={editor()} {...props} />;
}

/**
 * Root `Tiptap` component.
 */
export const Tiptap = Object.assign(TiptapWrapper, {
  Content: TiptapContent,
});

export default Tiptap;
