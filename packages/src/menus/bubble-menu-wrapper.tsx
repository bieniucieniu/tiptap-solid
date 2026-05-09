import {
  BubbleMenuPlugin,
  type BubbleMenuPluginProps,
} from "@tiptap/extension-bubble-menu";
import { nanoid } from "nanoid";
import { type Component, type JSX, onMount } from "solid-js";

type BubbleMenuWrapperProps = Omit<
  BubbleMenuPluginProps,
  "element" | "pluginKey" | "shouldShow"
> & {
  class?: string;
  children?: JSX.Element;
  shouldShow?: BubbleMenuPluginProps["shouldShow"];
};

const BubbleMenuWrapper: Component<BubbleMenuWrapperProps> = (props) => {
  let container: HTMLDivElement | null = null;
  const pluginKey = nanoid();

  onMount(() => {
    const { editor, shouldShow, tippyOptions } = props;

    if (container) {
      editor.registerPlugin(
        BubbleMenuPlugin({
          editor,
          pluginKey,
          shouldShow: (props) => {
            if (shouldShow) {
              return shouldShow(props);
            }

            return false;
          },
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

export type { BubbleMenuWrapperProps };
export { BubbleMenuWrapper };
