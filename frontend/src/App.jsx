import { useState, useEffect } from "react";
import SignUpLogin from "./components/SignUpLogin";
import WelcomeMessage from "./components/WelcomeMessage";
import ButtonRow from "./components/ButtonRow";
import DocumentTitleInput from "./components/DocumentTitleInput";
import DocumentsList from "./components/DocumentsList";
import Notifications from "./components/Notifications";
import FileMenu from "./components/FileMenu";
import RichTextEditor from "./components/RichTextEditor";

const API_BASE = "http://localhost:3000"; // Backend API URL

// The app component
const App = () => {
  // Get the user from localStorage (or null if not found)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Document state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [documents, setDocuments] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Notification and file menu state
  const [notifications, setNotifications] = useState([]);
  const [showFileMenu, setShowFileMenu] = useState(false);

  // Load user's documents
  useEffect(() => {
    if (user) loadDocuments();
  }, [user]);

  // Load documents from API
  const loadDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${user.id}/documents`);
      const data = await res.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      addNotification("Failed to load documents", "error");
    }
  };

  // Function for adding notifications
  const addNotification = (message, type = "success") => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // Save document
  const handleSave = async () => {
    if (!title.trim()) return addNotification("Title required", "error");

    const htmlContent = content || "";

    try {
      const payload = { user_id: user.id, title, content: htmlContent };

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

      loadDocuments();
      addNotification("Document saved successfully!");
      setShowFileMenu(false);
    } catch (err) {
      console.error(err);
      addNotification("Failed to save document", "error");
    }
  };

  // Save-As always creates new doc
  const handleSaveAs = async () => {
    if (!content.trim()) return addNotification("Content required", "error");

    const htmlContent = content || "";

    const newTitle = prompt("Enter a title for the new document:");
    if (!newTitle) return;

    try {
      const payload = {
        user_id: user.id,
        title: newTitle,
        content: htmlContent,
      };

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

      loadDocuments();
      addNotification("Document saved successfully!");
      setShowFileMenu(false);
    } catch (err) {
      console.error(err);
      addNotification("Failed to save document", "error");
    }
  };

  // Edit existing doc
  const handleEdit = async (doc) => {
    setEditingId(doc.id);
    setTitle(doc.title);
    setContent(doc.content || "");

    if (!doc.content) {
      try {
        const res = await fetch(`${API_BASE}/documents/${doc.id}`);
        if (!res.ok) throw new Error("Failed to fetch document");

        const data = await res.json();
        setContent(data.content || "");
      } catch (err) {
        console.error(err);
      }
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
          color: "#eee",
        }}
      >
        <SignUpLogin setUser={setUser} addNotification={addNotification} />
        <Notifications notifications={notifications} />
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "32px",
        fontFamily: "Segoe UI, sans-serif",
        fontSize: "1.15rem",
        background: "linear-gradient(160deg, #1e1e28 0%, #2a2a38 100%)",
        minHeight: "100vh",
        color: "#000000ff",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <WelcomeMessage username={user.username} />

      <div style={{ display: "flex" }}>
        {/* File Menu Button */}
        <button
          onClick={() => setShowFileMenu(true)}
          style={{
            padding: "10px 20px",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "backgound 0.2s ease, transform 0.1s ease",
            height: "60px",
            width: "140px",
            backgroundColor: "#2b579a",
            marginRight: "1rem",
          }}
        >
          File
        </button>

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
          loadDocuments={loadDocuments}
          API_BASE={API_BASE}
          addNotification={addNotification}
          handleSave={handleSave}
        />
      </div>

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

      {/* Title Input */}
      <DocumentTitleInput title={title} setTitle={setTitle} />

      {/* Text Editor */}
      <RichTextEditor
        key={editingId ?? "new-document"}
        value={content}
        onChange={(html) => setContent(html)}
      />

      {/* Documents List */}
      {documents.length > 0 ? (
        <DocumentsList
          documents={documents}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      ) : (
        <p
          style={{
            color: "#ffffffff",
            fontStyle: "italic",
            background: "rgba(255, 255, 255, 0.4)",
            padding: "12px 16px",
            borderRadius: "8px",
            textAlign: "center",
            backdropFilter: "blur(4px)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          No documents yet — create your first one!
        </p>
      )}

      <Notifications notifications={notifications} />
    </div>
  );
};

export default App;
