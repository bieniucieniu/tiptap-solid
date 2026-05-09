import { createComponent, createContext, type JSX, useContext } from "solid-js";

export interface SolidNodeViewContextProps {
  onDragStart?: (event: DragEvent) => void;
  nodeViewContentRef?: (element: HTMLElement | null) => void;
  /**
   * This allows you to add children into the NodeViewContent component.
   * This is useful when statically rendering the content of a node view.
   */
  nodeViewContentChildren?: JSX.Element;
}

export const SolidNodeViewContext = createContext<SolidNodeViewContextProps>({
  onDragStart: () => {
    // no-op
  },
  nodeViewContentChildren: undefined,
  nodeViewContentRef: () => {
    // no-op
  },
});

export const SolidNodeViewContentProvider = ({
  children,
  content,
}: {
  children: JSX.Element;
  content: JSX.Element;
}) => {
  return createComponent(SolidNodeViewContext.Provider, {
    value: { nodeViewContentChildren: content },
    children,
  });
};

export const useSolidNodeView = () => useContext(SolidNodeViewContext);
