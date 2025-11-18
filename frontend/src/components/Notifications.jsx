const Notifications = ({ notifications }) => {
  return (
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
  );
};

export default Notifications;
