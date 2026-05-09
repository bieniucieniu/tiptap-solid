import type { ComponentProps } from "solid-js";
import { splitProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import { useSolidNodeView } from "./useSolidNodeView.js";

export interface NodeViewWrapperProps extends ComponentProps<"div"> {
  as?: string;
}

export function NodeViewWrapper(props: NodeViewWrapperProps) {
  const [local, rest] = splitProps(props, ["as", "style", "ref"]);
  const { onDragStart } = useSolidNodeView();

  return (
    <Dynamic
      component={local.as || "div"}
      {...rest}
      ref={local.ref}
      data-node-view-wrapper=""
      onDragStart={onDragStart}
      style={{
        "white-space": "normal",
        ...(typeof local.style === "object" ? local.style : {}),
      }}
    />
  );
}
