import type { EditorOptions } from "@tiptap/core";
import {
  type Component,
  createEffect,
  For,
  type JSX,
  onCleanup,
  splitProps,
} from "solid-js";
import { Dynamic, Portal } from "solid-js/web";
import type { SolidEditor } from "./editor";

function appendChildNodes(
  container: HTMLElement,
  element: EditorOptions["element"],
): HTMLElement {
  if (element && "mount" in element) {
    return element.mount;
  }
  if (typeof element === "function") {
    element(container);
  } else if (element) {
    container.append(...element.childNodes);
  }
  return container;
}

interface SolidEditorContentProps extends JSX.HTMLAttributes<HTMLDivElement> {
  editor: SolidEditor;
  ref?: (ref: HTMLDivElement) => void;
}

const SolidEditorContent: Component<SolidEditorContentProps> = (props) => {
  const [, passedProps] = splitProps(props, ["editor"]);
  let editorContentContainer: HTMLElement | null = null;

  createEffect(() => {
    const { editor } = props;

    if (editor && editor.options.element) {
      if (editorContentContainer) {
        editor.setOptions({
          element: appendChildNodes(
            editorContentContainer,
            editor.options.element,
          ),
        });
      }

      setTimeout(() => {
        if (!editor.isDestroyed) {
          editor.createNodeViews();
        }
      }, 0);
    }
  });
  onCleanup(() => {
    const { editor } = props;

    if (!editor) {
      return;
    }

    if (!editor.isDestroyed) {
      editor.view.setProps({
        nodeViews: {},
      });
    }

    if (
      !(editor.options.element instanceof Node) ||
      !editor.options.element.firstChild
    ) {
      return;
    }

    const newElement = document.createElement("div");

    editor.setOptions({
      element: appendChildNodes(newElement, editor.options.element),
    });
  });

  return (
    <>
      <div
        {...passedProps}
        ref={(ref) => {
          editorContentContainer = ref;
          props.ref?.(ref);
        }}
      />
      <For each={props.editor.renderers()}>
        {(renderer) => {
          return (
            <Portal mount={renderer.element}>
              <Dynamic
                component={renderer.component}
                state={renderer.state()}
              />
            </Portal>
          );
        }}
      </For>
    </>
  );
};

export type { SolidEditorContentProps };
export { SolidEditorContent };
