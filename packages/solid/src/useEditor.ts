import { Editor, type EditorOptions } from "@tiptap/core";
import { createSignal, onCleanup, onMount } from "solid-js";
import { useEditorState } from "./useEditorState.js";

const isSSR = typeof window === "undefined";

export type UseEditorOptions = Partial<EditorOptions> & {
  /**
   * Whether to render the editor on the first render.
   * If client-side rendering, set this to `true`.
   * If server-side rendering, set this to `false`.
   * @default true
   */
  immediatelyRender?: boolean;
  /**
   * Whether to re-render the editor on each transaction.
   * This is legacy behavior that will be removed in future versions.
   * @default false
   */
  shouldRerenderOnTransaction?: boolean;
};

export function useEditor(options: UseEditorOptions = {}): () => Editor | null {
  const [editor, setEditor] = createSignal<Editor | null>(null);

  onMount(() => {
    const isImmediatelyRender = options.immediatelyRender !== false;

    if (isSSR && isImmediatelyRender) {
      return;
    }

    const instance = new Editor({
      ...options,
    });

    setEditor(instance);

    onCleanup(() => {
      instance.destroy();
    });
  });

  // The default behavior is to re-render on each transaction
  // This is legacy behavior that will be removed in future versions
  useEditorState({
    editor,
    selector: ({ transactionNumber }) => {
      if (
        options.shouldRerenderOnTransaction === false ||
        options.shouldRerenderOnTransaction === undefined
      ) {
        return null;
      }

      if (options.immediatelyRender && transactionNumber === 0) {
        return 0;
      }
      return transactionNumber + 1;
    },
  });

  return editor;
}
