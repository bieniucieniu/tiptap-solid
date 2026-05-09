import { type Component, type JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

interface NodeViewContentProps {
  [key: string]: unknown;
  style?: JSX.CSSProperties;
  ref?: (ref: Element) => void;
  as?: string | Component<Record<string, unknown>>;
}

const NodeViewContent: Component<NodeViewContentProps> = (props) => {
  const [local, otherProps] = splitProps(props, ["ref"]);

  return (
    <Dynamic
      {...otherProps}
      component={props.as || "div"}
      ref={local.ref}
      data-node-view-content=""
      style={{
        ...props.style,
        whiteSpace: "pre-wrap",
      }}
    />
  );
};

export type { NodeViewContentProps };
export { NodeViewContent };
