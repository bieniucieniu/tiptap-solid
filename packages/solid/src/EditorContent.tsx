import type { Editor } from "@tiptap/core";
import type { ComponentProps, JSX } from "solid-js";
import { createEffect, createMemo, For, onCleanup, splitProps } from "solid-js";
import { createStore } from "solid-js/store";
import { Dynamic, Portal } from "solid-js/web";
import type { ContentComponent, EditorWithContentComponent } from "./editor";
import type { SolidRenderer } from "./SolidRenderer";

export interface EditorContentProps extends ComponentProps<"div"> {
  editor: Editor | null;
}

function getInstance(): ContentComponent {
  const [renderers, setRenderers] = createStore<Record<string, JSX.Element>>({});

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
  const [local, rest] = splitProps(props, ["editor"]);

  createEffect(() => {
    const editor: EditorWithContentComponent | null = local.editor;
    const element = editorContentRef;

    if (!editor || editor.isDestroyed || !element) {
      return;
    }

    if (editor.contentComponent && editor.isEditorContentInitialized) {
      return;
    }

    if (editor.view.dom?.parentNode) {
      element.append(...Array.from(editor.view.dom.parentNode.childNodes));
    }

    editor.setOptions({
      element,
    });

    editor.contentComponent = getInstance();
    editor.createNodeViews();
    editor.isEditorContentInitialized = true;

    onCleanup(() => {
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
  });

  const portals = createMemo((): JSX.Element[] => {
    const editor: EditorWithContentComponent | null = local.editor;
    const renderers = editor?.contentComponent?.renderers;
    if (!renderers) {
      return [];
    }

    return Object.values(renderers).filter((portal): portal is JSX.Element => portal != null);
  });

  return (
    <>
      <div ref={editorContentRef} {...rest} />
      <For each={portals()}>{(portal) => portal}</For>
    </>
  );
};
