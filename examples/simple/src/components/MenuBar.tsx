import type { Component } from "solid-js";
import { useTiptap, useTiptapState } from "tiptap-solid";

const Button: Component<{
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
  children: any;
}> = (props) => (
  <button
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
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isHeading1: ctx.editor.isActive("heading", { level: 1 }),
      isHeading2: ctx.editor.isActive("heading", { level: 2 }),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isCodeBlock: ctx.editor.isActive("codeBlock"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      canUndo: ctx.editor.can().chain().focus().undo().run(),
      canRedo: ctx.editor.can().chain().focus().redo().run(),
    }),
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
        onClick={() =>
          ctx.editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        isActive={states()?.isHeading1}
      >
        H1
      </Button>
      <Button
        onClick={() =>
          ctx.editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
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
      <Button
        onClick={() => ctx.editor.chain().focus().undo().run()}
        disabled={!states()?.canUndo}
      >
        Undo
      </Button>
      <Button
        onClick={() => ctx.editor.chain().focus().redo().run()}
        disabled={!states()?.canRedo}
      >
        Redo
      </Button>
    </div>
  );
};

export { Button };
