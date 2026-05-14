import { useState } from "react";
import { signupUser } from "../services/api";

export default function Signup({ setPage }) {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    if (!name || !lastName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

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
      alert(res.error || "Signup failed");
    }
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "50px auto",
        padding: "25px",
        border: "1px solid #ccc",
        borderRadius: "10px"
      }}
    >
      <h2>Member Signup</h2>

      <input
        type="text"
        placeholder="First Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px"
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px"
        }}
      />

      <button
        onClick={handleSignup}
        style={{
          width: "100%",
          padding: "10px",
          cursor: "pointer"
        }}
      >
        Create Member Account
      </button>

      <p
        onClick={() => setPage("login")}
        style={{
          marginTop: "15px",
          cursor: "pointer",
          textAlign: "center"
        }}
      >
        Already have an account? Login
      </p>
    </div>
  );
}