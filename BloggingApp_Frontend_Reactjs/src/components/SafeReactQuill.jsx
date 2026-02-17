import React, { useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const SafeReactQuill = ({ value, onChange }) => {
  const quillRef = useRef(null);

  useEffect(() => {
    // Clean warning: ensure no findDOMNode used
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      if (editor && editor.root) {
        editor.root.setAttribute("spellcheck", true);
      }
    }
  }, []);

  return (
    <div className="rounded-lg border border-gray-300">
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SafeReactQuill;
