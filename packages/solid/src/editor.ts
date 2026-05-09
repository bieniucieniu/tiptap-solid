import type { Editor } from "@tiptap/core";
import type { JSX } from "solid-js";

import type { SolidRenderer } from "./SolidRenderer.js";

export type AnyProps = Record<string, any>;

export type EditorWithContentComponent<P extends AnyProps = AnyProps> =
  Editor & {
    contentComponent?: ContentComponent<P> | null;
    isEditorContentInitialized?: boolean;
  };

export type ContentComponent<P extends AnyProps = AnyProps> = {
  setRenderer(id: string, renderer: SolidRenderer<P>): void;
  removeRenderer(id: string): void;
  renderers: () => Record<string, JSX.Element>;
};
