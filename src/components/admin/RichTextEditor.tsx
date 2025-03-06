import React, { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ align: [] }],
    ['link', 'image'],
    ['clean'],
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'align',
  'link',
  'image',
];

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  useEffect(() => {
    // Add dark mode classes to the editor
    const addDarkModeClasses = () => {
      const editor = document.querySelector('.ql-toolbar');
      const container = document.querySelector('.ql-container');
      
      if (editor && container) {
        editor.classList.add('dark:bg-dark-secondary', 'dark:border-gray-600');
        container.classList.add('dark:bg-dark-secondary', 'dark:border-gray-600');
      }
    };

    addDarkModeClasses();
  }, []);

  return (
    <div className="rich-text-editor">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="bg-white dark:bg-dark-secondary rounded-md min-h-[200px]"
      />
    </div>
  );
};

export default RichTextEditor;