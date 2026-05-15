import {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  getProjects,
  getTasks,
  updateTask
} from "../services/api";

export default function MemberDashboard({
  token,
  setToken
}) {

  const [projects, setProjects] =
    useState([]);

  const [tasks, setTasks] =
    useState([]);

  const [
    selectedProject,
    setSelectedProject
  ] = useState(null);

  const loadProjects =
    useCallback(async () => {

      const data =
        await getProjects(token);

      setProjects(
        Array.isArray(data)
          ? data
          : []
      );

    }, [token]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const loadTasks = async (
    projectId
  ) => {

    setSelectedProject(
      projectId
    );

    const data =
      await getTasks(
        token,
        projectId
      );

    setTasks(
      Array.isArray(data)
        ? data
        : []
    );
  };

  const handleStatus =
    async (
      id,
      status
    ) => {

      const res =
        await updateTask(
          token,
          id,
          {
            status
          }
        );

      setTasks(
        tasks.map((task) =>
          task._id === id
            ? res
            : task
        )
      );
    };

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    setToken(null);
  };

  const buttonStyle = (bgColor = "#007BFF", textColor = "white") => ({
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    background: bgColor,
    color: textColor,
    transition: "background-color 0.3s"
  });

  const getStatusColor = (status) => {
    switch(status) {
      case "done": return { bg: "#E8F5E9", text: "#28A745", label: "✓ Done" };
      case "overdue": return { bg: "#FFEBEE", text: "#FF4444", label: "⚠ Overdue" };
      case "underway": return { bg: "#FFF3E0", text: "#FFB800", label: "→ Underway" };
      default: return { bg: "#E3F2FD", text: "#007BFF", label: "○ Pending" };
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: "Inter, Arial",
        fontSize: "14px",
        color: "#222",
        overflow: "hidden"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          height: "70px",
          borderBottom: "3px solid #007BFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          background: "linear-gradient(135deg, #007BFF 0%, #0056b3 100%)",
          flexShrink: 0
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            margin: 0,
            color: "white"
          }}
        >
          Member Dashboard
        </h1>

        <button
          onClick={
            handleLogout
          }
          style={{...buttonStyle("#FF4444", "white")}}
          onMouseEnter={(e) => e.target.style.background = "#CC0000"}
          onMouseLeave={(e) => e.target.style.background = "#FF4444"}
        >
          Logout
        </button>
      </div>

      {/* BODY */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
          gap: "1px",
          background: "#e0e0e0"
        }}
      >

        {/* LEFT PROJECT SECTION */}
        <div
          style={{
            width: "100%",
            maxWidth: "280px",
            borderRight: "3px solid #e0e0e0",
            padding: "15px",
            overflowY: "auto",
            background: "#f8f9fa"
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "#007BFF",
              marginBottom: "15px"
            }}
          >
            Projects
          </h2>

          {projects.length ===
            0 && (
              <div
                style={{
                  border:
                    "2px dashed #ddd",
                  borderRadius:
                    "10px",
                  padding: "20px",
                  background:
                    "white",
                  textAlign:
                    "center",
                  fontSize: "14px",
                  color: "#999"
                }}
              >
                No Projects Assigned
              </div>
            )}

          {projects.map(
            (project) => (
              <div
                key={
                  project._id
                }
                onClick={() =>
                  loadTasks(
                    project._id
                  )
                }
                style={{
                  border:
                    selectedProject === project._id ? "3px solid #007BFF" : "2px solid #ddd",
                  borderRadius:
                    "10px",
                  padding:
                    "12px",
                  marginBottom:
                    "10px",
                  background:
                    selectedProject ===
                      project._id
                      ? "#E3F2FD"
                      : "white",
                  cursor:
                    "pointer",
                  transition: "all 0.3s"
                }}
              >
                <h3
                  style={{
                    fontSize:
                      "16px",
                    fontWeight: "700",
                    marginBottom:
                      "5px",
                    color: "#222"
                  }}
                >
                  {
                    project.title
                  }
                </h3>

                <p
                  style={{
                    fontSize:
                      "13px",
                    margin: 0,
                    color: "#666"
                  }}
                >
                  {
                    project.description
                  }
                </p>
              </div>
            )
          )}
        </div>

        {/* RIGHT TASK SECTION */}
        <div
          style={{
            flex: 1,
            padding: "15px",
            overflowY: "auto",
            background: "white"
          }}
        >
          <div
            style={{
              border: "2px solid #e0e0e0",
              borderRadius: "10px",
              padding: "15px",
              background: "white"
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "15px",
                color: "#007BFF"
              }}
            >
              Tasks
            </h2>

            {!selectedProject ? (
              <div
                style={{
                  border:
                    "2px dashed #ddd",
                  borderRadius:
                    "10px",
                  padding: "40px 20px",
                  textAlign:
                    "center",
                  fontSize:
                    "16px",
                  color: "#999"
                }}
              >
                Select Project To View Tasks
              </div>
            ) : tasks.length ===
              0 ? (
              <div
                style={{
                  border:
                    "2px dashed #ddd",
                  borderRadius:
                    "10px",
                  padding: "40px 20px",
                  textAlign:
                    "center",
                  fontSize:
                    "16px",
                  color: "#999"
                }}
              >
                No Tasks Found
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "15px"
                }}
              >
                {tasks.map((task) => {

                  const isOverdue =
                    task.dueDate &&
                    new Date(task.dueDate) <
                    new Date() &&
                    task.status !== "done";

                  const statusInfo = getStatusColor(isOverdue ? "overdue" : task.status);

                  return (
                    <div
                      key={task._id}
                      style={{
                        border: "2px solid #e0e0e0",
                        borderRadius: "10px",
                        padding: "15px",
                        background: "white",
                        transition: "transform 0.2s, box-shadow 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "16px",
                          fontWeight: "700",
                          marginBottom: "10px",
                          color: "#222"
                        }}
                      >
                        {task.title}
                      </h3>

                      <p
                        style={{
                          fontSize: "14px",
                          marginBottom: "10px",
                          color: "#666"
                        }}
                      >
                        {task.description ||
                          "No Description"}
                      </p>

                      <div
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          background: statusInfo.bg,
                          color: statusInfo.text,
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                          marginBottom: "10px"
                        }}
                      >
                        {statusInfo.label}
                      </div>

                      <p
                        style={{
                          fontSize: "13px",
                          marginBottom: "12px",
                          color: "#666"
                        }}
                      >
                        Due: {task.dueDate
                          ? new Date(
                            task.dueDate
                          ).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            }
                          )
                          : "No Due Date"}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap"
                        }}
                      >
                        <button
                          onClick={() =>
                            handleStatus(
                              task._id,
                              "underway"
                            )
                          }
                          style={{
                            ...buttonStyle("#FFB800", "white"),
                            flex: 1,
                            fontSize: "12px"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#CC9500"}
                          onMouseLeave={(e) => e.target.style.background = "#FFB800"}
                        >
                          Underway
                        </button>

                        <button
                          onClick={() =>
                            handleStatus(
                              task._id,
                              "done"
                            )
                          }
                          style={{
                            ...buttonStyle("#28A745", "white"),
                            flex: 1,
                            fontSize: "12px"
                          }}
                          onMouseEnter={(e) => e.target.style.background = "#218838"}
                          onMouseLeave={(e) => e.target.style.background = "#28A745"}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}