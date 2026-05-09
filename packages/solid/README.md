# tiptap-solid

SolidJS components for [Tiptap](https://tiptap.dev).

## Installation

```bash
npm install tiptap-solid @tiptap/core @tiptap/pm
```

## Usage

```tsx
import { createMemo } from 'solid-js'
import { Tiptap, TiptapContent, useEditor } from 'tiptap-solid'
import StarterKit from '@tiptap/starter-kit'

const MyEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World!</p>',
  })

  return (
    <Tiptap editor={editor}>
      <TiptapContent />
    </Tiptap>
  )
}
```

## License

MIT
