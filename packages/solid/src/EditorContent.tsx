import type { Editor } from "@tiptap/core";
import type { ComponentProps, JSX } from "solid-js";
import { For, onCleanup, onMount, splitProps } from "solid-js";
import { createStore } from "solid-js/store";
import { Dynamic, Portal } from "solid-js/web";
import type { ContentComponent, EditorWithContentComponent } from "./editor";
import type { SolidRenderer } from "./SolidRenderer";

export interface EditorContentProps extends ComponentProps<"div"> {
  editor: Editor | null;
}

function getInstance(): ContentComponent {
  const [renderers, setRenderers] = createStore<Record<string, JSX.Element>>(
    {},
  );

  return {
    renderers,
    setRenderer(id: string, renderer: SolidRenderer) {
      setRenderers(
        id,
        <Portal mount={renderer.element}>
          <Dynamic component={renderer.component} {...renderer.props} />
        </Portal>,
      );
    },
    removeRenderer(id: string) {
      setRenderers(id, undefined);
    },
  };
}

export const EditorContent = (props: EditorContentProps) => {
  let editorContentRef: HTMLDivElement | undefined;
  const [, rest] = splitProps(props, ["editor"]);

  onMount(() => {
    const editor = props.editor as EditorWithContentComponent | null;

    if (editor && !editor.isDestroyed && editor.view.dom?.parentNode) {
      if (editor.contentComponent) {
        return;
      }

      const element = editorContentRef;
      if (!element) return;

      element.append(...Array.from(editor.view.dom.parentNode.childNodes));

      editor.setOptions({
        element,
      });

      editor.contentComponent = getInstance();
      editor.createNodeViews();
      editor.isEditorContentInitialized = true;
    }
  });

  onCleanup(() => {
    const editor = props.editor as EditorWithContentComponent | null;

    if (!editor) {
      return;
    }

    editor.isEditorContentInitialized = false;

    if (!editor.isDestroyed) {
      editor.view.setProps({
        nodeViews: {},
      });
    }

    editor.contentComponent = null;

    try {
      if (!editor.view.dom?.parentNode) {
        return;
      }

      const newElement = document.createElement("div");
      newElement.append(...Array.from(editor.view.dom.parentNode.childNodes));

      editor.setOptions({
        element: newElement,
      });
    } catch {
      // do nothing
    }
  });
  return (
    <>
      <div ref={editorContentRef} {...rest} />
      <For
        each={Object.values(
          (props.editor as EditorWithContentComponent)?.contentComponent
            ?.renderers || {},
        )}
      >
        {(portal) => portal}
      </For>
    </>
  );
};
