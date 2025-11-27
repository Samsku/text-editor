const WelcomeMessage = ({ username }) => {
  return (
    <h1
      style={{
        fontWeight: "700",
        fontSize: "2rem",
        marginBottom: "1.2rem",
        color: "#ffffff",
        borderLeft: "6px solid #ffd78a",
        paddingLeft: "12px",
      }}
    >
      Welcome, {username}!
    </h1>
  );
};

export default WelcomeMessage;
