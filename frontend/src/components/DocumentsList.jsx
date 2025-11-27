const DocumentsList = ({ documents = [], handleEdit, handleDelete }) => {
  console.log(documents);
  documents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const cardButton = {
    padding: "6px 14px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#fff",
    transition: "0.2s ease",
  };

  return (
    <>
      <h3
        style={{
          marginTop: "2rem",
          marginBottom: "1rem",
          fontSize: "1.4rem",
          fontWeight: "600",
          color: "#f1f1f1ff",
        }}
      >
        My Documents
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {documents.length === 0 && (
          <p
            style={{
              color: "#555",
              fontStyle: "italic",
              background: "rgba(255,255,255,0.4)",
              padding: "12px 16px",
              borderRadius: "8px",
              textAlign: "center",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            No documents yet — create your first one!
          </p>
        )}

        {documents.map((doc) => (
          <div
            key={doc.document_id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "1rem 1.2rem",
              borderRadius: "10px",
              background: "#ffffff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 6px 18px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
          >
            <span
              style={{
                fontWeight: "600",
                fontSize: "1rem",
                color: "#333",
              }}
            >
              {doc.title}
            </span>

            <div style={{ display: "flex", gap: "0.6rem" }}>
              <button
                onClick={() => handleEdit(doc)}
                style={{
                  ...cardButton,
                  background: "#2a9d8f",
                }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(doc.document_id)}
                style={{
                  ...cardButton,
                  background: "#d62839",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DocumentsList;
