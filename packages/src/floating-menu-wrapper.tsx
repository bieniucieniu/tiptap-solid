import {
  FloatingMenuPlugin,
  type FloatingMenuPluginProps,
} from "@tiptap/extension-floating-menu";
import { nanoid } from "nanoid";
import { type Component, type JSX, onMount } from "solid-js";

type FloatingMenuWrapperProps = Omit<
  FloatingMenuPluginProps,
  "element" | "pluginKey" | "shouldShow"
> & {
  class?: string;
  shouldShow?: FloatingMenuPluginProps["shouldShow"];
  children?: JSX.Element;
};

const FloatingMenuWrapper: Component<FloatingMenuWrapperProps> = (props) => {
  let container: HTMLDivElement | null = null;
  const pluginKey = nanoid();

  onMount(() => {
    const { editor, shouldShow, tippyOptions } = props;

    if (container) {
      editor.registerPlugin(
        FloatingMenuPlugin({
          editor,
          pluginKey,
          shouldShow: shouldShow || null,
          element: container,
          tippyOptions,
        }),
      );
    }
  });

  return (
    <div
      ref={(ref) => (container = ref)}
      class={props.class}
      style={{ visibility: "hidden" }}
    >
      {props.children}
    </div>
  );
};

export type { FloatingMenuWrapperProps };
export { FloatingMenuWrapper };
