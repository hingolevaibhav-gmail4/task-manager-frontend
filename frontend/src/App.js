import {
  useState,
  useEffect
} from "react";

import Login from "./pages/Login";

import Signup from "./pages/Signup";

import AdminDashboard from "./pages/AdminDashboard";

import MemberDashboard from "./pages/MemberDashboard";

function App() {

  const [token, setToken] =
    useState(null);

  const [role, setRole] =
    useState(null);

  const [page, setPage] =
    useState("login");

  // LOAD SAVED LOGIN
  useEffect(() => {

    const savedToken =
      localStorage.getItem(
        "token"
      );

    const savedRole =
      localStorage.getItem(
        "role"
      );

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedRole) {
      setRole(savedRole);
    }

  }, []);

  // LOGIN / SIGNUP PAGES
  if (!token) {

    return page === "login" ? (

      <Login
        setToken={setToken}
        setPage={setPage}
        setRole={setRole}
      />

    ) : (

      <Signup
        setPage={setPage}
      />

    );
  }

  // ADMIN DASHBOARD
  if (role === "admin") {

    return (
      <AdminDashboard
        token={token}
        setToken={setToken}
      />
    );
  }

  // MEMBER DASHBOARD
  return (
    <MemberDashboard
      token={token}
      setToken={setToken}
    />
  );
}

export default App;