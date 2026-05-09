import {
  FloatingMenuPlugin,
  type FloatingMenuPluginProps,
} from "@tiptap/extension-floating-menu";
import { createEffect, type JSX, onCleanup, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { useCurrentEditor } from "../Context";
import { getAutoPluginKey } from "./getAutoPluginKey";
import { useMenuElementProps } from "./useMenuElementProps";

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export type FloatingMenuProps = Omit<
  Optional<FloatingMenuPluginProps, "pluginKey">,
  "element" | "editor"
> & {
  editor: FloatingMenuPluginProps["editor"] | null;
} & JSX.HTMLAttributes<HTMLDivElement>;

export const FloatingMenu = (props: FloatingMenuProps) => {
  const [, rest] = splitProps(props, [
    "pluginKey",
    "editor",
    "updateDelay",
    "resizeDelay",
    "appendTo",
    "shouldShow",
    "options",
    "children",
    "ref",
  ]);

  const menuEl = document.createElement("div");
  const resolvedPluginKey = getAutoPluginKey(props.pluginKey, "floatingMenu");

  useMenuElementProps(menuEl, rest);

  createEffect(() => {
    if (typeof props.ref === "function") {
      props.ref(menuEl);
    }
  });

  const currentEditorCtx = useCurrentEditor();

  /**
   * The editor instance where the floating menu plugin will be registered.
   */
  const pluginEditor = () => props.editor || currentEditorCtx.editor();

  createEffect(() => {
    const editor = pluginEditor();

    if (!editor || editor.isDestroyed) {
      return;
    }

    const floatingMenuElement = menuEl;
    floatingMenuElement.style.visibility = "hidden";
    floatingMenuElement.style.position = "absolute";

    const plugin = FloatingMenuPlugin({
      updateDelay: props.updateDelay,
      resizeDelay: props.resizeDelay,
      appendTo: props.appendTo,
      pluginKey: resolvedPluginKey,
      shouldShow: props.shouldShow,
      options: props.options,
      editor: editor,
      element: floatingMenuElement,
    });

    editor.registerPlugin(plugin);

    onCleanup(() => {
      editor.unregisterPlugin(resolvedPluginKey);
      window.requestAnimationFrame(() => {
        if (floatingMenuElement.parentNode) {
          floatingMenuElement.parentNode.removeChild(floatingMenuElement);
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
        },
      }),
    );
  });

  return <Portal mount={menuEl}>{props.children}</Portal>;
};
