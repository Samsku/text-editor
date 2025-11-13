import "@abduljebar/text-editor/dist/index.css";
import { TextEditor } from "@abduljebar/text-editor";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:3000";

const App = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [documents, setDocuments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load documents
  useEffect(() => {
    if (user) loadDocuments();
  }, [user]);

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

  // Signup
  const handleSignup = async () => {
    if (!username || !email || !password)
      return addNotification("Fill all fields", "error");
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      addNotification("Signup successful!");
    } catch (err) {
      console.error(err);
      addNotification("Signup failed", "error");
    }
  };

  // Login
  const handleLogin = async () => {
    if (!email || !password) return addNotification("Fill all fields", "error");
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.status !== 200) return addNotification(data.message, "error");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      addNotification("Login successful!");
    } catch (err) {
      console.error(err);
      addNotification("Login failed", "error");
    }
  };

  // Logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    addNotification("Logged out successfully");
  };

  // Document saving
  const handleSave = async () => {
    if (!title.trim()) return addNotification("Title required", "error");
    try {
      const payload = { user_id: user.user_id, title, content };
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
      setTitle("");
      setEditingId(null);
      setContent("");
      if (editorRef) editorRef.setContent("");
      loadDocuments();
      addNotification("Document saved successfully!");
    } catch (err) {
      console.error(err);
      addNotification("Failed to save document", "error");
    }
  };

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

  // Account deletion
  const handleAccountDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${user.user_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete account");
      addNotification("Account deleted successfully!");
      handleLogout();
      setShowAccountModal(false);
    } catch (err) {
      console.error(err);
      addNotification("Failed to delete account", "error");
    }
  };

  // Show account modal
  const handleAccount = () => setShowAccountModal(true);

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
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "400px",
            position: "relative",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#333",
            }}
          >
            Welcome
          </h2>
          <input
            type="text"
            placeholder="Username (for signup)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              marginBottom: "1rem",
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              marginBottom: "1rem",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              outline: "none",
              marginBottom: "1rem",
            }}
          />
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              onClick={handleSignup}
              style={{
                flex: 1,
                padding: "12px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Signup
            </button>
            <button
              onClick={handleLogin}
              style={{
                flex: 1,
                padding: "12px",
                background: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            zIndex: 1000,
          }}
        >
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                color: "#fff",
                background: n.type === "error" ? "#dc3545" : "#28a745",
                fontWeight: "bold",
              }}
            >
              {n.message}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    // Welcome message, save, account, new document and logout button
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Welcome, {user.username}</h2>
      <button
        onClick={handleLogout}
        style={{
          marginBottom: "10px",
          background: "red",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      <button
        onClick={handleSave}
        style={{
          marginLeft: "1rem",
          padding: "10px 20px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save Document
      </button>
      <button
        style={{
          marginLeft: "1rem",
          padding: "10px 20px",
          background: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = "/")}
      >
        New Document
      </button>
      <button
        onClick={handleAccount}
        style={{
          marginLeft: "1rem",
          padding: "10px 20px",
          background: "#6c757d",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Account
      </button>

      {/* Account Modal */}
      {showAccountModal && (
        <div
          onClick={() => setShowAccountModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <h3>Account name: {user.username}</h3>
            <h3>Account email: {user.email}</h3>
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 16px",
                  background: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Logout
              </button>
              <button
                onClick={handleAccountDelete}
                style={{
                  padding: "8px 16px",
                  background: "red",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Delete Account
              </button>
              <button
                onClick={() => setShowAccountModal(false)}
                style={{
                  padding: "8px 16px",
                  background: "gray",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document title and editor */}
      <input
        type="text"
        placeholder="Document title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          margin: "10px 0",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />

      <TextEditor
        ref={setEditorRef}
        height="min-h-[400px]"
        initialContent={
          editingId
            ? documents.find((d) => d.document_id === editingId)?.content || ""
            : ""
        }
        showButtons
        onChange={setContent}
      />

      {/* Document list */}
      <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>My Documents</h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {documents.length === 0 && (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            No documents yet.
          </p>
        )}
        {documents.map((doc) => (
          <div
            key={doc.document_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem",
              borderRadius: "8px",
              background: "#fff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <span style={{ fontWeight: "bold", color: "#333" }}>
              {doc.title}
            </span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => handleEdit(doc)}
                style={{
                  padding: "6px 12px",
                  background: "#17a2b8",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(doc.document_id)}
                style={{
                  padding: "6px 12px",
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          zIndex: 1000,
        }}
      >
        {notifications.map((n) => (
          <div
            key={n.id}
            style={{
              padding: "10px 20px",
              borderRadius: "6px",
              color: "#fff",
              background: n.type === "error" ? "#dc3545" : "#28a745",
              fontWeight: "bold",
            }}
          >
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
