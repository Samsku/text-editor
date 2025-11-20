const DocumentsList = ({ documents = [], handleEdit, handleDelete }) => {
  console.log(documents);
  return (
    <>
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
    </>
  );
};

export default DocumentsList;
