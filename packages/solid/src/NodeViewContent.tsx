import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSolidNodeView } from "./useSolidNodeView.js";

export interface NodeViewContentProps extends ComponentProps<"div"> {
  as?: string;
}

export function NodeViewContent(props: NodeViewContentProps) {
  const [local, rest] = splitProps(props, ["as", "style"]);
  const { nodeViewContentRef, nodeViewContentChildren } = useSolidNodeView();

  return (
    <Dynamic
      component={local.as || "div"}
      {...rest}
      ref={nodeViewContentRef}
      data-node-view-content=""
      style={{
        "white-space": "pre-wrap",
        ...(typeof local.style === "object" ? local.style : {}),
      }}
    >
      {nodeViewContentChildren}
    </Dynamic>
  );
}
