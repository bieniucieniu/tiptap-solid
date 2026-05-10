import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Tiptap, useEditor } from "tiptap-solid";
import { MenuBar } from "../MenuBar";

export const BasicEditor = () => {
  const editor = useEditor(() => ({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write something..." }),
    ],
    content: `
      <h2>Basic Setup</h2>
      <p>This is a minimal Tiptap SolidJS integration using <strong>Tailwind 4</strong>.</p>
    `,
  }));

  return (
    <div class="tiptap-editor overflow-hidden border rounded-lg bg-white shadow-sm">
      <Tiptap editor={editor}>
        <MenuBar />
        <Tiptap.Content class="p-6 min-h-[300px] prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none" />
      </Tiptap>
    </div>
  );
};
