import { nanoid } from "nanoid";
import {
  type Accessor,
  type Component,
  createSignal,
  type Setter,
} from "solid-js";
import type { SolidEditor } from "./editor";
import type { SolidNodeViewProps } from "./types";

interface SolidRendererOptions<S = SolidNodeViewProps> {
  editor: SolidEditor;
  state: S;
  as?: string;
}

class SolidRenderer<R = unknown, S extends Record<string, any> = object> {
  public declare state: Accessor<S>;

  public declare setState: Setter<S>;

  public declare id: string;

  public declare element: Element;

  public declare component: Component<{ state: S }>;

  private declare editor: SolidEditor;

  public constructor(
    component: Component<{ state: S }>,
    { editor, state: initialState, as = "div" }: SolidRendererOptions<S>,
  ) {
    const [state, setState] = createSignal<S>(initialState);
    const element = document.createElement(as);

    this.setState = setState;
    this.state = state;
    this.element = element;
    this.component = component;
    this.id = nanoid();
    this.editor = editor;
    this.editor.setRenderers([
      ...this.editor.renderers(),
      this as unknown as SolidRenderer<SolidNodeViewProps>,
    ]);
  }

  public destroy(): void {
    this.editor.setRenderers((renderers) => {
      return renderers.filter((renderer) => renderer.id !== this.id);
    });
  }
}

export type { SolidRendererOptions };
export { SolidRenderer };
