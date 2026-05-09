import type { Component } from "solid-js";
import { EditorContent, useEditor } from "tiptap-solid";

const App: Component = () => {
	const editor = useEditor({
		extensions: [],
		content: "<p>Hello World! 🌎️</p>",
	});

	return (
		<div style={{ padding: "2rem" }}>
			<h1>TipTap Solid Example</h1>
			<div class="editor-container">
				<EditorContent editor={editor()} />
			</div>
		</div>
	);
};

export default App;
