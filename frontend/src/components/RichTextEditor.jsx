import { useEffect, useRef } from "react";

const buttonStyle = {
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#111827",
  cursor: "pointer",
  fontWeight: 600,
};

const RichTextEditor = ({ value = "", onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;
    const html = value || "";
    if (editorRef.current.innerHTML !== html) {
      editorRef.current.innerHTML = html;
    }
  }, [value]);

  const execCommand = (command, option = null) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, option);
    onChange?.(editor.innerHTML);
  };

  const handleInput = () => {
    onChange?.(editorRef.current?.innerHTML || "");
  };

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid #d1d5db",
        background: "#ffffff",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          padding: "12px",
          borderBottom: "1px solid #e5e7eb",
          background: "#f9fafb",
        }}
      >
        <button type="button" style={buttonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand("bold")}>
          Bold
        </button>
        <button type="button" style={buttonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand("italic")}>
          Italic
        </button>
        <button type="button" style={buttonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand("underline")}>
          Underline
        </button>
        <button type="button" style={buttonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand("formatBlock", "h1")}>
          H1
        </button>
        <button type="button" style={buttonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand("formatBlock", "h2")}>
          H2
        </button>
        <button type="button" style={buttonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand("insertUnorderedList")}>
          Bullet list
        </button>
        <button type="button" style={buttonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand("insertOrderedList")}>
          Numbered list
        </button>
        <button type="button" style={buttonStyle} onMouseDown={(e) => e.preventDefault()} onClick={() => execCommand("formatBlock", "blockquote")}>
          Quote
        </button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          minHeight: "420px",
          padding: "20px 22px",
          outline: "none",
          color: "#111827",
          background: "#ffffff",
          fontSize: "1rem",
          lineHeight: 1.7,
        }}
      />
    </div>
  );
};

export default RichTextEditor;
