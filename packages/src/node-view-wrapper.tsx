import { type Component, type JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useSolidNodeView } from "./use-solid-node-view";

interface NodeViewWrapperProps {
  [key: string]: unknown;
  style?: JSX.CSSProperties;
  ref?: (ref: Element) => void;
  as?: string | Component<Record<string, unknown>>;
}

const NodeViewWrapper: Component<NodeViewWrapperProps> = (props) => {
  const nv = useSolidNodeView();
  const [local, otherProps] = splitProps(props, ["ref"]);

  return (
    <Dynamic
      {...otherProps}
      component={props.as || "div"}
      ref={local.ref}
      data-node-view-wrapper="true"
      onDragStart={(e: DragEvent) => nv.onDragStart?.(e)}
      style={{
        ...props.style,
        whiteSpace: "normal",
      }}
    />
  );
};

export type { NodeViewWrapperProps };
export { NodeViewWrapper };
