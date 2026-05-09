import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Show } from "solid-js";
import { Tiptap, useEditor } from "tiptap-solid";
import { BubbleMenu, FloatingMenu } from "tiptap-solid/menus";
import { Button } from "../MenuBar";

export const MenusEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Select text or start a new line...",
      }),
    ],
    content: `
      <p>Try selecting some text to see the <strong>Bubble Menu</strong>.</p>
      <p>Or start a new empty line to see the <strong>Floating Menu</strong>.</p>
      <p></p>
    `,
  });

  return (
    <div class="tiptap-editor overflow-hidden relative border rounded-lg bg-white shadow-sm">
      <Tiptap editor={editor}>
        <Show when={editor()}>
          {(e) => (
            <>
              <BubbleMenu editor={e()} class="flex bg-white border border-border shadow-xl rounded-lg overflow-hidden p-1.5 gap-1 animate-in fade-in zoom-in duration-200">
                <Button onClick={() => e().chain().focus().toggleBold().run()}>B</Button>
                <Button onClick={() => e().chain().focus().toggleItalic().run()}>I</Button>
                <Button onClick={() => e().chain().focus().toggleStrike().run()}>S</Button>
              </BubbleMenu>

              <FloatingMenu editor={e()} class="flex bg-white border border-border shadow-xl rounded-lg overflow-hidden p-1.5 gap-1 animate-in fade-in slide-in-from-left-4 duration-300">
                <Button onClick={() => e().chain().focus().toggleHeading({ level: 1 }).run()}>H1</Button>
                <Button onClick={() => e().chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
                <Button onClick={() => e().chain().focus().toggleBulletList().run()}>UL</Button>
              </FloatingMenu>
            </>
          )}
        </Show>
        <Tiptap.Content class="p-6 min-h-[300px] prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none" />
      </Tiptap>
    </div>
  );
};
