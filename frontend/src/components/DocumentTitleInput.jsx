const DocumentTitleInput = ({ title, setTitle }) => {
  return (
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
        color: "#fff",
        background: "#0f1620ff",
      }}
    />
  );
};

export default DocumentTitleInput;
