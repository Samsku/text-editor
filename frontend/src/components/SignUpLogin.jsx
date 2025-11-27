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
        background: "linear-gradient(145deg, #1e1e1e, #232323)",
        padding: "2.5rem",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        width: "100%",
        maxWidth: "420px",
        position: "relative",
        color: "#e5e5e5",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "1.8rem",
          fontWeight: 600,
          color: "#ffffff",
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
          width: "100%",
          padding: "14px",
          borderRadius: "8px",
          border: "1px solid #3a3a3a",
          background: "#2a2a2a",
          color: "#fefefe",
          fontSize: "1rem",
          marginBottom: "1.2rem",
          transition: "0.2s border-color, 0.2s box-shadow",
          outline: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#0d6efd";
          e.target.style.boxShadow = "0 0 0 3px rgba(13,110,253,0.25)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#3a3a3a";
          e.target.style.boxShadow = "none";
        }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "8px",
          border: "1px solid #3a3a3a",
          background: "#2a2a2a",
          color: "#fefefe",
          fontSize: "1rem",
          marginBottom: "1.2rem",
          transition: "0.2s border-color, 0.2s box-shadow",
          outline: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#0d6efd";
          e.target.style.boxShadow = "0 0 0 3px rgba(13,110,253,0.25)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#3a3a3a";
          e.target.style.boxShadow = "none";
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "8px",
          border: "1px solid #3a3a3a",
          background: "#2a2a2a",
          color: "#fefefe",
          fontSize: "1rem",
          marginBottom: "1.5rem",
          transition: "0.2s border-color, 0.2s box-shadow",
          outline: "none",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#0d6efd";
          e.target.style.boxShadow = "0 0 0 3px rgba(13,110,253,0.25)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#3a3a3a";
          e.target.style.boxShadow = "none";
        }}
      />

      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          onClick={handleSignup}
          style={{
            flex: 1,
            padding: "14px",
            background: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "0.2s background, 0.2s transform",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#0b5ed7")}
          onMouseLeave={(e) => (e.target.style.background = "#0d6efd")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Signup
        </button>

        <button
          onClick={handleLogin}
          style={{
            flex: 1,
            padding: "14px",
            background: "#198754",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "1rem",
            cursor: "pointer",
            transition: "0.2s background, 0.2s transform",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#157347")}
          onMouseLeave={(e) => (e.target.style.background = "#198754")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default SignUpLogin;
