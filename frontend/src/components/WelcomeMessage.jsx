const WelcomeMessage = ({ username }) => {
  return (
    <h1
      style={{
        fontWeight: "bold",
        color: "#333",
        marginBottom: "1rem",
      }}
    >
      Welcome, {username}!
    </h1>
  );
};

export default WelcomeMessage;
