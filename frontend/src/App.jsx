import "@abduljebar/text-editor/dist/index.css";
import { TextEditor } from "@abduljebar/text-editor";
import { useState, useEffect } from "react";
import SignUpLogin from "./components/SignUpLogin";
import WelcomeMessage from "./components/WelcomeMessage";
import ButtonRow from "./components/ButtonRow";
import DocumentTitleInput from "./components/DocumentTitleInput";
import DocumentsList from "./components/DocumentsList";
import Notifications from "./components/Notifications";

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
  // const [showAccountModal, setShowAccountModal] = useState(false);

  // Load documents
  useEffect(() => {
    if (user) loadDocuments();
  }, [user]);

  // const handleLogout = () => {
  //   setUser(null);
  //   localStorage.removeItem("user");
  //   addNotification("Logged out successfully");
  // };

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

  useEffect(() => {
    if (editingId && editorRef) {
      const doc = documents.find((d) => d.document_id === editingId);
      if (doc) editorRef.setContent(doc.content);
    }
  }, [editingId, editorRef]);

  // Notifications
  const addNotification = (message, type = "success") => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  // ...

  // Document editing
  const handleEdit = (doc) => {
    setEditingId(doc.document_id);
    setTitle(doc.title);
  };

  // Document deletion
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
        {/* Notifications */}
        <Notifications notifications={notifications} />
      </div>
    );
  }

  return (
    // Welcome message, save, account, new document and logout button
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <WelcomeMessage username={user.username} />

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

      {/* Document title and editor */}
      <DocumentTitleInput title={title} setTitle={setTitle} />

      <TextEditor
        ref={setEditorRef}
        height="min-h-[400px]"
        initialContent={
          editingId
            ? documents.find((d) => d.document_id === editingId)?.content || ""
            : ""
        }
        showButtons={false}
        onChange={setContent}
      />

      {/* Document list */}
      <DocumentsList
        documents={documents}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {/* Notifications */}
      <Notifications notifications={notifications} />
    </div>
  );
};

export default App;
