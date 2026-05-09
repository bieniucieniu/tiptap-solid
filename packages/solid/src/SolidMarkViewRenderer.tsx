import type {
  MarkViewProps,
  MarkViewRenderer,
  MarkViewRendererOptions,
} from "@tiptap/core";
import { MarkView } from "@tiptap/core";
import type { Component, ComponentProps } from "solid-js";
import { createContext, splitProps, useContext } from "solid-js";
import { Dynamic } from "solid-js/web";

import { SolidRenderer } from "./SolidRenderer";

export interface MarkViewContextProps {
  markViewContentRef: (element: HTMLElement | null) => void;
}

export const SolidMarkViewContext = createContext<MarkViewContextProps>({
  markViewContentRef: () => {
    // do nothing
  },
});

export type MarkViewContentProps = {
  as?: string;
} & ComponentProps<"span">;

export const MarkViewContent = (props: MarkViewContentProps) => {
  const [local, rest] = splitProps(props, ["as"]);
  const { markViewContentRef } = useContext(SolidMarkViewContext);

  return (
    <Dynamic
      component={local.as || "span"}
      {...rest}
      ref={markViewContentRef}
      data-mark-view-content=""
    />
  );
};

export interface SolidMarkViewRendererOptions extends MarkViewRendererOptions {
  as?: string;
  className?: string;
  attrs?: { [key: string]: string };
}

export class SolidMarkView extends MarkView<
  Component<MarkViewProps>,
  SolidMarkViewRendererOptions
> {
  renderer: SolidRenderer<MarkViewProps>;
  contentDOMElement: HTMLElement;

  constructor(
    component: Component<MarkViewProps>,
    props: MarkViewProps,
    options?: Partial<SolidMarkViewRendererOptions>,
  ) {
    super(component, props, options);

    const { as = "span", attrs, className = "" } = options || {};
    const componentProps = {
      ...props,
      updateAttributes: this.updateAttributes.bind(this),
    } satisfies MarkViewProps;

    this.contentDOMElement = document.createElement("span");

    const markViewContentRef: MarkViewContextProps["markViewContentRef"] = (
      el,
    ) => {
      if (el && !el.contains(this.contentDOMElement)) {
        el.appendChild(this.contentDOMElement);
      }
    };

    const SolidMarkViewProvider: Component<MarkViewProps> = (props) => {
      return (
        <SolidMarkViewContext.Provider value={{ markViewContentRef }}>
          <this.component {...props} />
        </SolidMarkViewContext.Provider>
      );
    };

    this.renderer = new SolidRenderer(SolidMarkViewProvider, {
      editor: props.editor,
      props: componentProps,
      as,
      className: `mark-${props.mark.type.name} ${className}`.trim(),
    });

    if (attrs) {
      this.renderer.updateAttributes(attrs);
    }
  }

  get dom() {
    return this.renderer.element;
  }

  get contentDOM() {
    return this.contentDOMElement;
  }
}

export function SolidMarkViewRenderer(
  component: Component<MarkViewProps>,
  options: Partial<SolidMarkViewRendererOptions> = {},
): MarkViewRenderer {
  return (props) => new SolidMarkView(component, props, options);
}
