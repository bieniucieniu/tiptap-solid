import type { Editor } from "@tiptap/core";
import type { ComponentProps, JSX } from "solid-js";
import { createContext, splitProps, useContext } from "solid-js";

import { EditorContent } from "./EditorContent";
import type { UseEditorOptions } from "./useEditor";
import { useEditor } from "./useEditor";

export type EditorContextValue = {
  editor: () => Editor | null;
};

export const EditorContext = createContext<EditorContextValue>({
  editor: () => null,
});

/**
 * A hook to get the current editor instance.
 */
export const useCurrentEditor = () => useContext(EditorContext);

export interface EditorProviderProps extends UseEditorOptions {
  children?: JSX.Element;
  slotBefore?: JSX.Element;
  slotAfter?: JSX.Element;
  editorContainerProps?: ComponentProps<"div">;
}

/**
 * This is the provider component for the editor.
 * It allows the editor to be accessible across the entire component tree
 * with `useCurrentEditor`.
 */
export function EditorProvider(props: EditorProviderProps) {
  const [local, editorOptions] = splitProps(props, [
    "children",
    "slotAfter",
    "slotBefore",
    "editorContainerProps",
  ]);
  const editor = useEditor(editorOptions);

  const contextValue = { editor };

  return (
    <EditorContext.Provider value={contextValue}>
      {local.slotBefore}
      <EditorContent
        editor={editor()}
        {...(local.editorContainerProps || {})}
      />
      {local.children}
      {local.slotAfter}
    </EditorContext.Provider>
  );
}
