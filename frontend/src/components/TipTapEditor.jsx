import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TiptapEditor = ({ onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded border ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded border ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded border ${editor.isActive('bulletList') ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          • Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded border ${editor.isActive('orderedList') ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          1. Ordered List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`px-3 py-1 rounded border ${editor.isActive('paragraph') ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          Paragraph
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-3 py-1 rounded border ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 rounded border ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-600 text-white' : 'bg-white'}`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          className="px-3 py-1 rounded border bg-red-100"
        >
          Clear
        </button>
      </div>

      <div className="border min-h-[200px] rounded-md p-3">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TiptapEditor;
