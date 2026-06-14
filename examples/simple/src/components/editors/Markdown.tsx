import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import Placeholder from "@tiptap/extension-placeholder";
import { Tiptap, useEditor, useTiptapState } from "tiptap-solid";
import { MenuBar } from "../MenuBar";

export const MarkdownEditor = () => {
  const editor = useEditor(() => ({
    extensions: [StarterKit, Markdown, Placeholder.configure({ placeholder: "Try markdown..." })],
    content: `
# Markdown Support
You can **copy/paste** markdown here, or export the content as markdown!
- Lists work
- *Italics* work
- [Links](https://tiptap.dev) work
    `,
  }));

  const markdown = useTiptapState({
    editor,
    selector: (ctx) =>
      // @ts-expect-error markdown storage comes from tiptap-markdown extension
      ctx.editor?.storage.markdown.getMarkdown() ?? "",
  });

  return (
    <div class="space-y-4">
      <div class="tiptap-editor overflow-hidden border rounded-lg bg-white shadow-sm">
        <Tiptap editor={editor}>
          <MenuBar />
          <Tiptap.Content class="p-6 min-h-[300px] prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none max-w-none" />
        </Tiptap>
      </div>
      <div class="p-6 bg-muted rounded-lg border border-dashed">
        <h3 class="text-xs font-bold mb-3 uppercase tracking-widest text-muted-foreground">
          Markdown Output
        </h3>
        <pre class="text-sm overflow-auto whitespace-pre-wrap font-mono text-primary/80">
          {markdown()}
        </pre>
      </div>
    </div>
  );
};
