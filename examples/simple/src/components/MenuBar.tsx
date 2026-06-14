import type { Component } from "solid-js";
import { useTiptap, useTiptapState } from "tiptap-solid";

const Button: Component<{
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: any;
}> = (props) => (
  <button
    onMouseDown={(e) => e.preventDefault()}
    onClick={props.onClick}
    disabled={props.disabled}
    class={`px-3 py-1 text-sm font-medium transition-colors rounded-md border 
      ${
        props.isActive
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
      } ${props.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    {props.children}
  </button>
);

export const MenuBar = () => {
  const ctx = useTiptap();

  const states = useTiptapState({
    editor: () => ctx.editor,
    selector: (ctx) => {
      const editor = ctx.editor;
      if (!editor) {
        return {
          isBold: false,
          isItalic: false,
          isStrike: false,
          isCode: false,
          isHeading1: false,
          isHeading2: false,
          isBulletList: false,
          isOrderedList: false,
          isCodeBlock: false,
          isBlockquote: false,
          canUndo: false,
          canRedo: false,
        };
      }

      return {
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isStrike: editor.isActive("strike"),
        isCode: editor.isActive("code"),
        isHeading1: editor.isActive("heading", { level: 1 }),
        isHeading2: editor.isActive("heading", { level: 2 }),
        isBulletList: editor.isActive("bulletList"),
        isOrderedList: editor.isActive("orderedList"),
        isCodeBlock: editor.isActive("codeBlock"),
        isBlockquote: editor.isActive("blockquote"),
        canUndo: editor.can().chain().focus().undo().run(),
        canRedo: editor.can().chain().focus().redo().run(),
      };
    },
  });

  return (
    <div class="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
      <Button
        onClick={() => ctx.editor.chain().focus().toggleBold().run()}
        isActive={states()?.isBold}
      >
        Bold
      </Button>
      <Button
        onClick={() => ctx.editor.chain().focus().toggleItalic().run()}
        isActive={states()?.isItalic}
      >
        Italic
      </Button>
      <Button
        onClick={() => ctx.editor.chain().focus().toggleStrike().run()}
        isActive={states()?.isStrike}
      >
        Strike
      </Button>
      <Button
        onClick={() => ctx.editor.chain().focus().toggleCode().run()}
        isActive={states()?.isCode}
      >
        Code
      </Button>
      <div class="w-px h-6 bg-border mx-1 self-center" />
      <Button
        onClick={() => ctx.editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={states()?.isHeading1}
      >
        H1
      </Button>
      <Button
        onClick={() => ctx.editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={states()?.isHeading2}
      >
        H2
      </Button>
      <Button
        onClick={() => ctx.editor.chain().focus().toggleBulletList().run()}
        isActive={states()?.isBulletList}
      >
        Bullet
      </Button>
      <Button
        onClick={() => ctx.editor.chain().focus().toggleOrderedList().run()}
        isActive={states()?.isOrderedList}
      >
        Ordered
      </Button>
      <div class="w-px h-6 bg-border mx-1 self-center" />
      <Button onClick={() => ctx.editor.chain().focus().undo().run()} disabled={!states()?.canUndo}>
        Undo
      </Button>
      <Button onClick={() => ctx.editor.chain().focus().redo().run()} disabled={!states()?.canRedo}>
        Redo
      </Button>
    </div>
  );
};

export { Button };
