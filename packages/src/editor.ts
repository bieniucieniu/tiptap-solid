import { Editor, type EditorOptions } from "@tiptap/core";
import { type Accessor, createSignal, type Setter } from "solid-js";
import type { SolidRenderer } from "./solid-renderer";

class SolidEditor extends Editor {
  public declare renderers: Accessor<SolidRenderer[]>;

  public declare setRenderers: Setter<SolidRenderer[]>;

  public constructor(options?: Partial<EditorOptions>) {
    const [renderers, setRenderers] = createSignal<SolidRenderer[]>([]);

    super(options);
    this.renderers = renderers;
    this.setRenderers = setRenderers;
  }
}

export { SolidEditor };
