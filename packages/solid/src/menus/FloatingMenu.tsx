import {
  FloatingMenuPlugin,
  type FloatingMenuPluginProps,
} from "@tiptap/extension-floating-menu";
import { createEffect, type JSX, onCleanup, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { useCurrentEditor } from "../Context.js";
import { getAutoPluginKey } from "./getAutoPluginKey.js";
import { useMenuElementProps } from "./useMenuElementProps.js";

export type FloatingMenuProps = Omit<
  FloatingMenuPluginProps,
  "element" | "editor"
> & {
  editor?: FloatingMenuPluginProps["editor"];
  children: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
  [key: string]: any;
};

export const FloatingMenu = (props: FloatingMenuProps) => {
  const [local, rest] = splitProps(props, [
    "pluginKey",
    "editor",
    "updateDelay",
    "resizeDelay",
    "appendTo",
    "shouldShow",
    "options",
    "children",
  ]);

  const menuEl = document.createElement("div");
  const resolvedPluginKey = getAutoPluginKey(local.pluginKey, "floatingMenu");

  useMenuElementProps(menuEl, rest);

  const { editor: currentEditor } = useCurrentEditor();

  createEffect(() => {
    const pluginEditor = local.editor || currentEditor();

    if (!pluginEditor || pluginEditor.isDestroyed) {
      return;
    }

    menuEl.style.visibility = "hidden";
    menuEl.style.position = "absolute";

    const plugin = FloatingMenuPlugin({
      updateDelay: local.updateDelay,
      resizeDelay: local.resizeDelay,
      appendTo: local.appendTo,
      pluginKey: resolvedPluginKey,
      shouldShow: local.shouldShow,
      options: local.options,
      editor: pluginEditor,
      element: menuEl,
    });

    pluginEditor.registerPlugin(plugin);

    onCleanup(() => {
      pluginEditor.unregisterPlugin(resolvedPluginKey);
      if (menuEl.parentNode) {
        menuEl.parentNode.removeChild(menuEl);
      }
    });
  });

  createEffect(() => {
    const pluginEditor = local.editor || currentEditor();

    if (!pluginEditor || pluginEditor.isDestroyed) {
      return;
    }

    pluginEditor.view.dispatch(
      pluginEditor.state.tr.setMeta(resolvedPluginKey, {
        type: "updateOptions",
        options: {
          updateDelay: local.updateDelay,
          resizeDelay: local.resizeDelay,
          shouldShow: local.shouldShow,
          options: local.options,
          appendTo: local.appendTo,
        },
      }),
    );
  });

  return <Portal mount={menuEl}>{local.children}</Portal>;
};
