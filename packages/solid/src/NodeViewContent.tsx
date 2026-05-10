import type { ComponentProps } from "solid-js";
import { type JSX, splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { useSolidNodeView } from "./useSolidNodeView";

export interface NodeViewContentProps extends ComponentProps<"div"> {
  as?: keyof JSX.IntrinsicElements | (string & {});
}

export function NodeViewContent(props: NodeViewContentProps) {
  const [, rest] = splitProps(props, ["as", "style"]);
  const nv = useSolidNodeView();

  return (
    <Dynamic
      component={props.as || "div"}
      {...rest}
      ref={nv.nodeViewContentRef}
      data-node-view-content=""
      style={{
        "white-space": "pre-wrap",
        ...(typeof props.style === "object" ? props.style : {}),
      }}
    >
      {nv.nodeViewContentChildren}
    </Dynamic>
  );
}
