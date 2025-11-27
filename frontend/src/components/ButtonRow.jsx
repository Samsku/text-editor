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
  handleSave,
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

  const buttonBase = {
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
  };

  const buttonBaseSmall = {
    padding: "8px 16px",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: "500",
    transition: "background 0.2s ease, transform 0.1s ease",
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            ...buttonBase,
            background: "#e63946",
          }}
        >
          Logout
        </button>

        {/* Save */}
        <button
          onClick={handleSave}
          style={{
            ...buttonBase,
            background: "#2a9d8f",
          }}
        >
          Save Document
        </button>

        {/* New Document */}
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            ...buttonBase,
            background: "#457b9d",
          }}
        >
          New Document
        </button>

        {/* Account */}
        <button
          onClick={handleAccount}
          style={{
            ...buttonBase,
            background: "#6c757d",
          }}
        >
          Account
        </button>
      </div>

      {showAccountModal && (
        <div
          onClick={() => setShowAccountModal(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#1f1f1f",
              padding: "2.5rem 2rem",
              borderRadius: "16px",
              width: "360px",
              textAlign: "center",
              boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
              color: "#f2f2f2",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>
              Account name:{" "}
              <span style={{ color: "#fff" }}>{user.username}</span>
            </h3>
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 500 }}>
              Account email: <span style={{ color: "#ccc" }}>{user.email}</span>
            </h3>

            <div
              style={{
                display: "flex",
                gap: "0.8rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "#e63946",
                  color: "#fff",
                  transition: "0.2s transform, 0.2s background",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f44355")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#e63946")
                }
              >
                Logout
              </button>

              <button
                onClick={handleAccountDelete}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "#d00000",
                  color: "#fff",
                  transition: "0.2s transform, 0.2s background",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#ff1f1f")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#d00000")
                }
              >
                Delete Account
              </button>

              <button
                onClick={() => setShowAccountModal(false)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "8px",
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: "#6c757d",
                  color: "#fff",
                  transition: "0.2s transform, 0.2s background",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#5a6268")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#6c757d")
                }
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
