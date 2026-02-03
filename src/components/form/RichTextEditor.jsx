import React, { useMemo, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div style={{ height: 200, border: '1px solid #d9d9d9', borderRadius: 6, padding: 8 }}>Loading editor...</div>
});

// Import CSS separately
import 'react-quill/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = "Enter description...", height = 200, disabled = false }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'link', 'image'
  ];

  if (!isClient) {
    return (
      <div style={{ 
        height: height, 
        border: '1px solid #d9d9d9', 
        borderRadius: 6, 
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999'
      }}>
        Loading editor...
      </div>
    );
  }

  if (disabled) {
    return (
      <div style={{ 
        height: height, 
        border: '1px solid #d9d9d9', 
        borderRadius: 6, 
        padding: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        backgroundColor: '#f5f5f5'
      }}>
        Please select a category first
      </div>
    );
  }

  return (
    <div style={{ height: height }}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: height - 42 }}
      />
    </div>
  );
};

export default RichTextEditor;
