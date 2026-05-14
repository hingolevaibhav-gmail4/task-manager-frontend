import { useState } from "react";

import { loginUser } from "../services/api";

export default function Login({
  setToken,
  setPage,
  setRole
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    const res = await loginUser({
      email,
      password
    });

    if (res.token) {

      // SAVE TOKEN
      localStorage.setItem(
        "token",
        res.token
      );

      // SAVE ROLE
      localStorage.setItem(
        "role",
        res.role
      );

      // SET STATE
      setToken(res.token);

      setRole(res.role);

    } else {

      alert(
        res.error || "Login failed"
      );
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
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
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
        onChange={(e) =>
          setPassword(
            e.target.value
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "15px"
        }}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "10px",
          cursor: "pointer"
        }}
      >
        Login
      </button>

      <p
        onClick={() =>
          setPage("signup")
        }
        style={{
          marginTop: "15px",
          cursor: "pointer",
          textAlign: "center"
        }}
      >
        Create new account
      </p>
    </div>
  );
}