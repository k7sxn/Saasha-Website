import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { uploadImage } from '../../lib/supabase';
import { 
  Bold, Italic, Heading2, List, Link as LinkIcon, Image as ImageIcon, 
  AlignLeft, AlignCenter, AlignRight, Quote, Code, Undo, Redo
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-saasha-rose dark:text-dark-accent underline',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      try {
        const imageUrl = await uploadImage(file);
        editor.chain().focus().setImage({ src: imageUrl }).run();
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const addLink = () => {
    if (!editor) return;

    const url = window.prompt('Enter URL:');
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run();
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    active = false,
    children 
  }: { 
    onClick: () => void; 
    active?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
        active ? 'bg-gray-200 dark:bg-gray-700' : ''
      }`}
    >
      {children}
    </button>
  );

  if (!editor) {
    return null;
  }

  return (
    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
      <div className="bg-white dark:bg-dark-secondary p-2 border-b dark:border-gray-700">
        <div className="flex flex-wrap gap-1 mb-2">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
          >
            <Bold className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
          >
            <Italic className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
          >
            <List className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
          >
            <Quote className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive('codeBlock')}
          >
            <Code className="w-5 h-5" />
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
          >
            <AlignLeft className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
          >
            <AlignCenter className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
          >
            <AlignRight className="w-5 h-5" />
          </ToolbarButton>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <ToolbarButton onClick={addLink} active={editor.isActive('link')}>
            <LinkIcon className="w-5 h-5" />
          </ToolbarButton>
          <label className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <ImageIcon className="w-5 h-5" />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            active={false}
          >
            <Undo className="w-5 h-5" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            active={false}
          >
            <Redo className="w-5 h-5" />
          </ToolbarButton>
        </div>
      </div>
      <EditorContent 
        editor={editor} 
        className="prose dark:prose-invert max-w-none p-4 min-h-[200px] bg-white dark:bg-dark-secondary text-gray-900 dark:text-gray-100"
      />
    </div>
  );
};

export default RichTextEditor;
