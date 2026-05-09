import {
  BubbleMenuPlugin,
  type BubbleMenuPluginProps,
} from "@tiptap/extension-bubble-menu";
import { createEffect, type JSX, onCleanup, splitProps } from "solid-js";
import { Portal } from "solid-js/web";
import { useCurrentEditor } from "../Context.js";
import { getAutoPluginKey } from "./getAutoPluginKey.js";
import { useMenuElementProps } from "./useMenuElementProps.js";

export type BubbleMenuProps = Omit<
  BubbleMenuPluginProps,
  "element" | "editor"
> & {
  editor?: BubbleMenuPluginProps["editor"];
  children: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
  [key: string]: any;
};

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
  ]);

  const menuEl = document.createElement("div");
  const resolvedPluginKey = getAutoPluginKey(props.pluginKey, "bubbleMenu");

  useMenuElementProps(menuEl, rest);

  const { editor: currentEditor } = useCurrentEditor();

  createEffect(() => {
    const pluginEditor = props.editor || currentEditor();

    if (!pluginEditor || pluginEditor.isDestroyed) {
      return;
    }

    menuEl.style.visibility = "hidden";
    menuEl.style.position = "absolute";

    const plugin = BubbleMenuPlugin({
      updateDelay: props.updateDelay,
      resizeDelay: props.resizeDelay,
      appendTo: props.appendTo,
      pluginKey: resolvedPluginKey,
      shouldShow: props.shouldShow,
      getReferencedVirtualElement: props.getReferencedVirtualElement,
      options: props.options,
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
    const pluginEditor = props.editor || currentEditor();

    if (!pluginEditor || pluginEditor.isDestroyed) {
      return;
    }

    pluginEditor.view.dispatch(
      pluginEditor.state.tr.setMeta(resolvedPluginKey, {
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
