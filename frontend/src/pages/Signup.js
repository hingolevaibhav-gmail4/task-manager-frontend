import { useState } from "react";
import { signupUser } from "../services/api";

export default function Signup({ setPage }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !lastName || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await signupUser({
        name,
        lastName,
        email,
        password
      });

      if (res._id) {
        alert("Account created successfully! Please login.");
        setPage("login");
      } else {
        if (res.error?.includes("duplicate")) {
          setError("Email already registered");
        } else {
          setError(res.error || "Signup failed");
        }
      }
    } catch (err) {
      setError(
        "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  const buttonStyle = (bgColor = "#22C55E") => ({
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    background: bgColor,
    color: "white",
    transition: "all 0.3s ease-in-out",
    width: "100%"
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "#f5f5f5",
        fontFamily: "Inter, Arial"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "white",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "700",
            marginBottom: "5px",
            color: "#222",
            textAlign: "center"
          }}
        >
          TaskFlow
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "#666",
            textAlign: "center",
            marginBottom: "25px"
          }}
        >
          Create Your Account
        </p>

        {error && (
          <div
            style={{
              padding: "12px 15px",
              marginBottom: "15px",
              background: "#FFEBEE",
              border: "1px solid #FF3B30",
              borderRadius: "8px",
              color: "#FF3B30",
              fontSize: "13px",
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
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "text"
          }}
          onFocus={(e) => e.target.style.borderColor = "#222"}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => {
            setLastName(e.target.value);
            setError("");
          }}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "text"
          }}
          onFocus={(e) => e.target.style.borderColor = "#222"}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "text"
          }}
          onFocus={(e) => e.target.style.borderColor = "#222"}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          onKeyPress={handleKeyPress}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            fontSize: "14px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "text"
          }}
          onFocus={(e) => e.target.style.borderColor = "#222"}
          onBlur={(e) => e.target.style.borderColor = "#ddd"}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          style={buttonStyle("#22C55E")}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 12px rgba(34, 197, 94, 0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p
          onClick={() => setPage("login")}
          style={{
            marginTop: "15px",
            cursor: "pointer",
            textAlign: "center",
            fontSize: "14px",
            color: "#3B82F6",
            fontWeight: "500",
            transition: "color 0.3s"
          }}
          onMouseEnter={(e) => e.target.style.color = "#222"}
          onMouseLeave={(e) => e.target.style.color = "#3B82F6"}
        >
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}