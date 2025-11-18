import { useState } from "react";

const SignUpLogin = ({ setUser, addNotification }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState([]);
  const API_BASE = "http://localhost:3000";

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

      if (!res.ok) {
        return addNotification(data.message, "error");
      }

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
  return (
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
  );
};

export default SignUpLogin;
