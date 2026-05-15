import { useState } from "react";
import { signupUser } from "../services/api";

export default function Signup({ setPage }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name || !lastName || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    setError("");
    const res = await signupUser({
      name,
      lastName,
      email,
      password
    });

    if (res._id) {
      alert("Account created successfully");
      setPage("login");
    } else {
      setError(res.error || "Signup failed");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "450px",
          padding: "40px 30px",
          border: "none",
          borderRadius: "15px",
          background: "white",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
        }}
      >
        <h2
          style={{
            fontSize: "32px",
            fontWeight: "700",
            marginBottom: "10px",
            color: "#007BFF",
            textAlign: "center"
          }}
        >
          TaskFlow
        </h2>

        <p
          style={{
            fontSize: "16px",
            color: "#666",
            textAlign: "center",
            marginBottom: "30px"
          }}
        >
          Create Your Account
        </p>

        {error && (
          <div
            style={{
              padding: "12px 15px",
              marginBottom: "20px",
              background: "#FFE5E5",
              border: "2px solid #FF4444",
              borderRadius: "8px",
              color: "#FF4444",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="First Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            fontSize: "16px",
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
            outline: "none",
            fontFamily: "inherit"
          }}
          onFocus={(e) => e.target.style.borderColor = "#007BFF"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setError("");
          }}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            fontSize: "16px",
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
            outline: "none",
            fontFamily: "inherit"
          }}
          onFocus={(e) => e.target.style.borderColor = "#007BFF"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            fontSize: "16px",
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
            outline: "none",
            fontFamily: "inherit"
          }}
          onFocus={(e) => e.target.style.borderColor = "#007BFF"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "25px",
            fontSize: "16px",
            border: "2px solid #e0e0e0",
            borderRadius: "8px",
            outline: "none",
            fontFamily: "inherit"
          }}
          onFocus={(e) => e.target.style.borderColor = "#007BFF"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />

        <button
          onClick={handleSignup}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "15px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "600",
            border: "none",
            borderRadius: "8px",
            background: "#28A745",
            color: "white",
            transition: "background-color 0.3s"
          }}
          onMouseEnter={(e) => e.target.style.background = "#218838"}
          onMouseLeave={(e) => e.target.style.background = "#28A745"}
        >
          Create Account
        </button>

        <p
          onClick={() => setPage("login")}
          style={{
            marginTop: "15px",
            cursor: "pointer",
            textAlign: "center",
            fontSize: "16px",
            color: "#007BFF",
            fontWeight: "500",
            transition: "color 0.3s"
          }}
          onMouseEnter={(e) => e.target.style.color = "#0056b3"}
          onMouseLeave={(e) => e.target.style.color = "#007BFF"}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}