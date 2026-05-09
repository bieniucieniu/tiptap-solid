import {
  BubbleMenuPlugin,
  type BubbleMenuPluginProps,
} from "@tiptap/extension-bubble-menu";
import { createEffect, type JSX, onCleanup, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { useCurrentEditor } from "../Context";
import { getAutoPluginKey } from "./getAutoPluginKey";
import { useMenuElementProps } from "./useMenuElementProps";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type BubbleMenuProps = Optional<
  Omit<Optional<BubbleMenuPluginProps, "pluginKey">, "element">,
  "editor"
> &
  JSX.HTMLAttributes<HTMLDivElement>;

export const BubbleMenu = (props: BubbleMenuProps) => {
  const [, rest] = splitProps(props, [
    "pluginKey",
    "editor",
    "updateDelay",
    "resizeDelay",
    "appendTo",
    "shouldShow",
    "getReferencedVirtualElement",
    "options",
    "children",
    "ref",
  ]);

  const menuEl = document.createElement("div");
  const resolvedPluginKey = getAutoPluginKey(props.pluginKey, "bubbleMenu");

  useMenuElementProps(menuEl, rest);

  createEffect(() => {
    if (typeof props.ref === "function") {
      props.ref(menuEl);
    }
  });

  const currentEditorCtx = useCurrentEditor();

  /**
   * The editor instance where the bubble menu plugin will be registered.
   */
  const pluginEditor = () => props.editor || currentEditorCtx.editor();

  createEffect(() => {
    const editor = pluginEditor();

    if (!editor || editor.isDestroyed) {
      return;
    }

    const bubbleMenuElement = menuEl;
    bubbleMenuElement.style.visibility = "hidden";
    bubbleMenuElement.style.position = "absolute";

    const plugin = BubbleMenuPlugin({
      updateDelay: props.updateDelay,
      resizeDelay: props.resizeDelay,
      appendTo: props.appendTo,
      pluginKey: resolvedPluginKey,
      shouldShow: props.shouldShow,
      getReferencedVirtualElement: props.getReferencedVirtualElement,
      options: props.options,
      editor: editor,
      element: bubbleMenuElement,
    });

    editor.registerPlugin(plugin);

    onCleanup(() => {
      editor.unregisterPlugin(resolvedPluginKey);
      window.requestAnimationFrame(() => {
        if (bubbleMenuElement.parentNode) {
          bubbleMenuElement.parentNode.removeChild(bubbleMenuElement);
        }
      });
    });
  });

  createEffect(() => {
    const editor = pluginEditor();

    if (!editor || editor.isDestroyed) {
      return;
    }

    editor.view.dispatch(
      editor.state.tr.setMeta(resolvedPluginKey, {
        type: "updateOptions",
        options: {
          updateDelay: props.updateDelay,
          resizeDelay: props.resizeDelay,
          shouldShow: props.shouldShow,
          options: props.options,
          appendTo: props.appendTo,
          getReferencedVirtualElement: props.getReferencedVirtualElement,
        },
      }),
    );
  });

  return <Portal mount={menuEl}>{props.children}</Portal>;
};
