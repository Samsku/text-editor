import { useState } from "react";
const ButtonRow = ({
  user,
  setUser,
  title,
  setTitle,
  content,
  setContent,
  editingId,
  setEditingId,
  editorRef,
  loadDocuments,
  API_BASE,
  addNotification,
}) => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const handleAccount = () => setShowAccountModal(true);
  const handleLogout = () => {
    // Clear title and content
    setTitle("");
    setContent("");
    setEditingId(null);
    setUser(null);
    localStorage.removeItem("user");
    addNotification("Logged out successfully");
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
  return (
    <>
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
                  cursor: "pointer",
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
                  cursor: "pointer",
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
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ButtonRow;
