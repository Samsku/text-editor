import "@abduljebar/text-editor/dist/index.css";
import { TextEditor } from "@abduljebar/text-editor";
import { useState, useEffect } from "react";
import SignUpLogin from "./components/SignUpLogin";
import WelcomeMessage from "./components/WelcomeMessage";
import ButtonRow from "./components/ButtonRow";
import DocumentTitleInput from "./components/DocumentTitleInput";
import DocumentsList from "./components/DocumentsList";
import Notifications from "./components/Notifications";
import FileMenu from "./components/FileMenu";

const API_BASE = "http://localhost:3000";

const App = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [documents, setDocuments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showFileMenu, setShowFileMenu] = useState(false);

  // Load user's documents
  useEffect(() => {
    if (user) loadDocuments();
  }, [user]);

  useEffect(() => {
    if (!editorRef) return;
    console.log("Editor finally ready:", editorRef);
  }, [editorRef]);

  // Load documents from API
  const loadDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${user.user_id}/documents`);
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
      addNotification("Failed to load documents", "error");
    }
  };

  // Notifications
  const addNotification = (message, type = "success") => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Save document (HTML content from editorRef)
  const handleSave = async () => {
    if (!title.trim()) return addNotification("Title required", "error");
    if (!editorRef) return addNotification("Editor not ready", "error");

    const htmlContent = editorRef.getContent();

    try {
      const payload = { user_id: user.user_id, title, content: htmlContent };

      const res = await fetch(
        editingId
          ? `${API_BASE}/documents/${editingId}`
          : `${API_BASE}/documents`,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Failed to save document");

      // ✅ Keep title as-is
      loadDocuments();
      addNotification("Document saved successfully!");
    } catch (err) {
      console.error(err);
      addNotification("Failed to save document", "error");
    }
  };

  // Save-As always creates new doc
  const handleSaveAs = async () => {
    if (!editorRef) return addNotification("Editor not ready", "error");

    const newTitle = prompt("Enter a new title");
    if (!newTitle || !newTitle.trim())
      return addNotification("Title required", "error");

    const htmlContent = editorRef.getContent();

    try {
      const payload = {
        user_id: user.user_id,
        title: newTitle.trim(),
        content: htmlContent,
      };

      const res = await fetch(`${API_BASE}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to Save As");

      // No clearing here either
      loadDocuments();
      addNotification("Document saved as new file!");
    } catch (err) {
      console.error(err);
      addNotification("Save As failed", "error");
    }
  };

  // Edit existing doc
  const handleEdit = (doc) => {
    setEditingId(doc.document_id);
    setTitle(doc.title);

    // Load HTML into editor
    if (editorRef) {
      editorRef.setContent(doc.content);
    }
  };

  // Delete document
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/documents/${id}`, { method: "DELETE" });
      loadDocuments();
      addNotification("Document deleted!");
    } catch (err) {
      console.error(err);
      addNotification("Failed to delete document", "error");
    }
  };

  // Print
  const handlePrint = () => {
    const editorElement = document.querySelector('[contenteditable="true"]');
    if (!editorElement) return;

    const htmlContent = editorElement.innerHTML;

    // Create hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";

    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;

    doc.open();
    doc.write(`
    <html>
      <head>
        <title>${title || ""}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
          }
          h1 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${htmlContent}
      </body>
    </html>
  `);
    doc.close();

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => document.body.removeChild(iframe), 1000);
  };

  const handleExportHTML = () => {
    const editorElement = document.querySelector('[contenteditable="true"]');
    if (!editorElement) return;

    const htmlContent = editorElement.innerHTML;
    const blob = new Blob(
      [
        `<!DOCTYPE html>
          <html>
          <head>
          <meta charset="UTF-8">
          <title>${title || "Document"}</title>
          <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          h1 { border-bottom: 1px solid #ddd; padding-bottom: 10px; }
          </style>
          </head>
          <body>
          <h1>${title || "Document"}</h1>
          ${htmlContent}
          </body>
          </html>`,
      ],
      { type: "text/html" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title || "document"}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleExportTXT = () => {
    const editorElement = document.querySelector('[contenteditable="true"]');
    if (!editorElement) return;

    const textContent = editorElement.innerText;
    const blob = new Blob([title, "\n", textContent], { type: "text/plain" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${title || "document"}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // If user is not logged in
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#f0f2f5",
          fontFamily: "Arial, sans-serif",
          padding: "1rem",
        }}
      >
        <SignUpLogin setUser={setUser} addNotification={addNotification} />
        <Notifications notifications={notifications} />
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <WelcomeMessage username={user.username} />

      {/* File Menu Button */}
      <button
        onClick={() => setShowFileMenu(true)}
        style={{
          padding: "6px 14px",
          marginBottom: "10px",
          border: "1px solid #ccc",
          background: "#eee",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        File
      </button>

      {/* File Menu */}
      <FileMenu
        isOpen={showFileMenu}
        onClose={() => setShowFileMenu(false)}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onPrint={handlePrint}
        documents={documents}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        onExportHTML={handleExportHTML}
        onExportTXT={handleExportTXT}
      />

      {/* Button Row */}
      <ButtonRow
        user={user}
        setUser={setUser}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        editingId={editingId}
        setEditingId={setEditingId}
        editorRef={editorRef}
        loadDocuments={loadDocuments}
        API_BASE={API_BASE}
        addNotification={addNotification}
      />

      {/* Title Input */}
      <DocumentTitleInput title={title} setTitle={setTitle} />

      {/* Text Editor */}
      <TextEditor
        ref={(instance) => {
          if (!instance) return;
          console.log("EDITOR INSTANCE:", instance);
          setEditorRef(instance);
        }}
        height="min-h-[400px]"
        initialContent={
          editingId
            ? documents.find((d) => d.document_id === editingId)?.content || ""
            : ""
        }
        showButtons={false}
        onChange={setContent}
      />

      {/* Documents List */}
      {documents.length > 0 ? (
        <DocumentsList
          documents={documents}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ) : (
        <p style={{ color: "#666", fontStyle: "italic" }}>No documents yet.</p>
      )}

      <Notifications notifications={notifications} />
    </div>
  );
};

export default App;
