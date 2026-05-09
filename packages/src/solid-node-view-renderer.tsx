import {
  type DecorationWithType,
  type Editor,
  isNodeViewSelected,
  NodeView,
  type NodeViewRenderer,
  type NodeViewRendererOptions,
  type NodeViewRendererProps,
} from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type {
  Decoration,
  DecorationSource,
  NodeView as ProseMirrorNodeView,
} from "@tiptap/pm/view";
import { type Component, createMemo, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { SolidEditor } from "./editor";
import { SolidRenderer } from "./solid-renderer";
import type { SolidNodeViewProps } from "./types";
import {
  SolidNodeViewContext,
  type SolidNodeViewContextProps,
} from "./use-solid-node-view";

export interface SolidNodeViewRendererOptions extends NodeViewRendererOptions {
  /**
   * This function is called when the node view is updated.
   * It allows you to compare the old node with the new node and decide if the component should update.
   */
  update:
    | ((props: {
        oldNode: ProseMirrorNode;
        oldDecorations: readonly Decoration[];
        oldInnerDecorations: DecorationSource;
        newNode: ProseMirrorNode;
        newDecorations: readonly Decoration[];
        innerDecorations: DecorationSource;
        updateProps: () => void;
      }) => boolean)
    | null;
  /**
   * The tag name of the element wrapping the React component.
   */
  as?: string;
  /**
   * The class name of the element wrapping the React component.
   */
  className?: string;
  /**
   * Attributes that should be applied to the element wrapping the React component.
   * If this is a function, it will be called each time the node view is updated.
   * If this is an object, it will be applied once when the node view is mounted.
   */
  attrs?:
    | Record<string, string>
    | ((props: {
        node: ProseMirrorNode;
        HTMLAttributes: Record<string, any>;
      }) => Record<string, string>);
}

type SetSelectionListener = (
  anchor: number,
  head: number,
  root: Document | ShadowRoot,
) => void;

class SolidNodeView<
  T = HTMLElement,
  Comp extends Component<SolidNodeViewProps<T>> = Component<
    SolidNodeViewProps<T>
  >,
  NodeEditor extends Editor = Editor,
  Options extends SolidNodeViewRendererOptions = SolidNodeViewRendererOptions,
> extends NodeView<Comp, SolidEditor, SolidNodeViewRendererOptions> {
  public setSelectionListeners: SetSelectionListener[] = [];

  public declare renderer: SolidRenderer;

  public declare contentDOMElement: HTMLElement;

  selectionRafId: number | null = null;

  private currentPos: number | undefined;

  constructor(
    component: Comp,
    props: NodeViewRendererProps,
    options?: Partial<Options>,
  ) {
    super(component, props, options);

    if (!this.node.isLeaf) {
      if (this.options.contentDOMElementTag) {
        this.contentDOMElement = document.createElement(
          this.options.contentDOMElementTag,
        );
      } else {
        this.contentDOMElement = document.createElement(
          this.node.isInline ? "span" : "div",
        );
      }

      this.contentDOMElement.dataset.nodeViewContentReact = "";
      this.contentDOMElement.dataset.nodeViewWrapper = "";

      // For some reason the whiteSpace prop is not inherited properly in Chrome and Safari
      // With this fix it seems to work fine
      // See: https://github.com/ueberdosis/tiptap/issues/1197
      this.contentDOMElement.style.whiteSpace = "inherit";

      const contentTarget = this.dom.querySelector("[data-node-view-content]");

      if (!contentTarget) {
        return;
      }

      contentTarget.appendChild(this.contentDOMElement);
    }
  }

  private cachedExtensionWithSyncedStorage:
    | NodeViewRendererProps["extension"]
    | null = null;

  /**
   * Returns a proxy of the extension that redirects storage access to the editor's mutable storage.
   * This preserves the original prototype chain (instanceof checks, methods like configure/extend work).
   * Cached to avoid proxy creation on every update.
   */
  get extensionWithSyncedStorage(): NodeViewRendererProps["extension"] {
    if (!this.cachedExtensionWithSyncedStorage) {
      const editor = this.editor;
      const extension = this.extension;

      this.cachedExtensionWithSyncedStorage = new Proxy(extension, {
        get(target, prop, receiver) {
          if (prop === "storage") {
            return (
              editor.storage[extension.name as keyof typeof editor.storage] ??
              {}
            );
          }
          return Reflect.get(target, prop, receiver);
        },
      });
    }

    return this.cachedExtensionWithSyncedStorage;
  }
  public get dom(): HTMLElement {
    const portalContainer = this.renderer.element.firstElementChild;

    if (
      portalContainer &&
      !portalContainer.firstElementChild?.hasAttribute("data-node-view-wrapper")
    ) {
      throw new Error(
        "Please use the NodeViewWrapper component for your node view.",
      );
    }

    return this.renderer.element as HTMLElement;
  }

  public get contentDOM(): HTMLElement | null {
    if (this.node.isLeaf) {
      return null;
    }

    this.maybeMoveContentDOM();

    return this.contentDOMElement;
  }

  public mount(): void {
    let ref: HTMLElement | null = null;
    const state: SolidNodeViewProps = {
      editor: this.editor,
      node: this.node,
      decorations: this.decorations as DecorationWithType[],
      selected: false,
      extension: this.extension,
      innerDecorations: this.innerDecorations,
      view: this.view,
      HTMLAttributes: this.HTMLAttributes,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode(),
      ref: (r) => {
        ref = r;
      },
    };

    const onDragStart = (e: DragEvent) => this.onDragStart(e);
    const nodeViewContentRef: SolidNodeViewContextProps["nodeViewContentRef"] =
      (element) => {
        if (
          element &&
          this.contentDOMElement &&
          element.firstChild !== this.contentDOMElement
        ) {
          // remove the nodeViewWrapper attribute from the element
          if (element.hasAttribute("data-node-view-wrapper")) {
            element.removeAttribute("data-node-view-wrapper");
          }
          element.appendChild(this.contentDOMElement);
        }
      };

    const SolidNodeViewProvider: Component<SolidNodeViewProps<T>> = (
      props,
    ): JSX.Element => {
      const context = {
        onDragStart,
        nodeViewContentRef,
      };

      return (
        <SolidNodeViewContext.Provider value={context}>
          <Dynamic
            component={(p: SolidNodeViewProps<T>) => this.component(p)}
            {...props}
          />
        </SolidNodeViewContext.Provider>
      );
    };

    const as = createMemo(
      () => this.options.as || (this.node.isInline ? "span" : "div"),
    );

    this.handleSelectionUpdate = this.handleSelectionUpdate.bind(this);

    this.renderer = new SolidRenderer(SolidNodeViewProvider, {
      editor: this.editor,
      state: state,
      as,
      className:
        `node-${this.node.type.name} ${this.options.className || ""}`.trim(),
    });
  }

  public maybeMoveContentDOM(): void {
    const contentElement = this.dom.querySelector("[data-node-view-content]");

    if (
      this.contentDOMElement &&
      contentElement &&
      !contentElement.contains(this.contentDOMElement)
    ) {
      contentElement.append(this.contentDOMElement);
    }
  }

  public update(
    node: ProseMirrorNode,
    decorations: DecorationWithType[],
  ): boolean {
    if (node.type !== this.node.type) {
      return false;
    }

    if (typeof this.options.update === "function") {
      const oldNode = this.node;
      const oldDecorations = this.decorations;

      this.node = node;
      this.decorations = decorations;

      return this.options.update({
        oldNode,
        oldDecorations,
        newNode: node,
        newDecorations: decorations,
        updateProps: () => this.updateProps({ node, decorations }),
      });
    }

    if (node === this.node && this.decorations === decorations) {
      return true;
    }

    this.node = node;
    this.decorations = decorations;
    this.updateProps({ node, decorations });

    return true;
  }

  public setSelection(
    anchor: number,
    head: number,
    root: Document | ShadowRoot,
  ): void {
    this.options.setSelection?.(anchor, head, root);
  }

  public selectNode(): void {
    this.renderer.setState?.((state) => ({ ...state, selected: true }));
  }

  public deselectNode(): void {
    this.renderer.setState?.((state) => ({ ...state, selected: false }));
  }

  public destroy(): void {
    this.renderer.destroy();
    this.contentDOMElement = null;
  }

  private updateProps(props: Partial<SolidNodeViewProps>): void {
    this.renderer.setState?.((state) => ({ ...state, ...props }));
    this.maybeMoveContentDOM();
  }
  handleSelectionUpdate() {
    if (this.selectionRafId) {
      cancelAnimationFrame(this.selectionRafId);
      this.selectionRafId = null;
    }

    this.selectionRafId = requestAnimationFrame(() => {
      this.selectionRafId = null;
      // Avoid resolving getPos() after ProseMirror has detached this node view.
      const pos = this.currentPos;
      if (typeof pos !== "number") {
        return;
      }

      const isSelected = isNodeViewSelected({
        selection: this.editor.state.selection,
        pos,
        nodeSize: this.node.nodeSize,
        selectedOnTextSelection: this.options.selectedOnTextSelection,
      });

      if (isSelected) {
        if (this.renderer.state().selected) {
          return;
        }

        this.selectNode();
      } else {
        if (!this.renderer.state().selected) {
          return;
        }

        this.deselectNode();
      }
    });
  }
}

const SolidNodeViewRenderer = (
  component: Component,
  options?: Partial<SolidNodeViewRendererOptions>,
): NodeViewRenderer => {
  return (props: NodeViewRendererProps) => {
    const { renderers, setRenderers } = props.editor as SolidEditor;

    if (!renderers || !setRenderers) {
      return {};
    }

    return new SolidNodeView(
      component,
      props,
      options,
    ) as unknown as ProseMirrorNodeView;
  };
};

export type { SolidNodeViewRendererOptions };
export { SolidNodeViewRenderer };
