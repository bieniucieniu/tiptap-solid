import type { ComponentProps, JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSolidNodeView } from "./useSolidNodeView";

export interface NodeViewWrapperProps extends ComponentProps<"div"> {
  as?: keyof JSX.IntrinsicElements | (string & {});
}

export function NodeViewWrapper(props: NodeViewWrapperProps) {
  const [, rest] = splitProps(props, ["as", "style", "ref"]);
  const nv = useSolidNodeView();

  return (
    <Dynamic
      component={props.as || "div"}
      {...rest}
      ref={props.ref}
      data-node-view-wrapper=""
      onDragStart={nv.onDragStart}
      style={{
        "white-space": "normal",
        ...(typeof props.style === "object" ? props.style : {}),
      }}
    />
  );
}
