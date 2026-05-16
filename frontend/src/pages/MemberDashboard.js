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

const scrollbarHideStyle = `
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

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

  const [stats, setStats] =
    useState({});

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

  const calculateStats =
    (tasksArray) => {

      const getDateOnly =
        (date) => {

          if (!date)
            return null;

          const d =
            new Date(date);

          return new Date(
            d.getFullYear(),
            d.getMonth(),
            d.getDate()
          );
        };

      const today =
        getDateOnly(
          new Date()
        );

      const total =
        tasksArray.length;

      const done =
        tasksArray.filter(
          (task) =>
            task.status ===
            "done"
        ).length;

      const overdue =
        tasksArray.filter(
          (task) => {

            if (
              !task.dueDate ||
              task.status ===
              "done"
            ) {
              return false;
            }

            const due =
              getDateOnly(
                task.dueDate
              );

            return due < today;
          }
        ).length;

      const pending =
        tasksArray.filter(
          (task) => {

            if (
              task.status !==
              "pending"
            ) {
              return false;
            }

            if (
              !task.dueDate
            ) {
              return true;
            }

            const due =
              getDateOnly(
                task.dueDate
              );

            return due >= today;
          }
        ).length;

      const underway =
        tasksArray.filter(
          (task) => {

            if (
              task.status !==
              "underway"
            ) {
              return false;
            }

            if (
              !task.dueDate
            ) {
              return true;
            }

            const due =
              getDateOnly(
                task.dueDate
              );

            return due >= today;
          }
        ).length;

      setStats({
        total,
        done,
        pending,
        underway,
        overdue
      });
    };

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

    const tasksArray =
      Array.isArray(data)
        ? data
        : [];

    setTasks(tasksArray);

    calculateStats(
      tasksArray
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

      const updatedTasks =
        tasks.map((task) =>
          task._id === id
            ? res
            : task
        );

      setTasks(
        updatedTasks
      );

      calculateStats(
        updatedTasks
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

  const cardStyle = (
    bgColor = "#fff"
  ) => ({
    flex: 1,
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "12px",
    background: bgColor,
    fontSize: "14px",
    textAlign: "center"
  });

  const buttonStyle = (
    bgColor = "#3B82F6",
    textColor = "white"
  ) => ({
    padding: "10px 16px",
    fontSize: "14px",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    border: "none",
    background: bgColor,
    color: textColor,
    transition:
      "all 0.3s ease-in-out"
  });

  const getStatusColor =
    (status) => {

      switch (status) {

        case "done":
          return {
            bg: "#E8F5E9",
            text: "#22C55E",
            label: "✓ Done"
          };

        case "overdue":
          return {
            bg: "#FFEBEE",
            text: "#FF3B30",
            label:
              "⚠ Overdue"
          };

        case "underway":
          return {
            bg: "#FFF3E0",
            text: "#F59E0B",
            label:
              "→ Underway"
          };

        default:
          return {
            bg: "#E3F2FD",
            text: "#3B82F6",
            label:
              "○ Pending"
          };
      }
    };

  return (
    <div
      style={{
        display: "flex",
        flexDirection:
          "column",
        minHeight: "100vh",
        fontFamily:
          "Inter, Arial",
        fontSize: "14px",
        color: "#222",
        overflow: "hidden"
      }}
    >
      <style>{scrollbarHideStyle}</style>

      {/* HEADER */}
      <div
        style={{
          height: "70px",
          borderBottom:
            "1px solid #ddd",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "space-between",
          padding:
            "0 20px",
          background: "white",
          flexShrink: 0
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "700",
            margin: 0,
            color: "#222"
          }}
        >
          Member Dashboard
        </h1>

        <button
          onClick={
            handleLogout
          }
          style={{
            ...buttonStyle(
              "#FF3B30",
              "white"
            )
          }}
          onMouseEnter={(
            e
          ) => {
            e.target.style.transform =
              "scale(1.05)";
            e.target.style.boxShadow =
              "0 8px 16px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(
            e
          ) => {
            e.target.style.transform =
              "scale(1)";
            e.target.style.boxShadow =
              "none";
          }}
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
          background:
            "#f5f5f5"
        }}
      >

        {/* LEFT SIDEBAR */}
        <div
          style={{
            width: "100%",
            maxWidth: "280px",
            borderRight:
              "1px solid #ddd",
            padding: "15px",
            overflowY: "auto",
            background:
              "#f8f9fa"
          }}
        >

          <div
            style={{
              marginBottom:
                "15px"
            }}
          >
            <div
              style={{
                marginBottom: "15px"
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#222",
                  marginBottom: "15px"
                }}
              >
                Projects
              </h2>
            </div>
          </div>

          {projects.length ===
            0 && (
              <div
                style={{
                  border:
                    "2px dashed #ddd",
                  borderRadius:
                    "10px",
                  padding:
                    "20px",
                  background:
                    "white",
                  textAlign:
                    "center",
                  fontSize:
                    "14px",
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
                    selectedProject ===
                      project._id
                      ? "1px solid #222"
                      : "1px solid #ddd",
                  borderRadius:
                    "10px",
                  padding:
                    "12px",
                  marginBottom:
                    "10px",
                  background:
                    selectedProject ===
                      project._id
                      ? "#f0f0f0"
                      : "white",
                  cursor:
                    "pointer",
                  transition:
                    "all 0.3s"
                }}
              >
                <h3
                  style={{
                    fontSize:
                      "16px",
                    fontWeight:
                      "700",
                    margin: 0,
                    marginBottom:
                      "16px",
                    color:
                      "#222"
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
                    color:
                      "#7e7e7e"
                  }}
                >
                  <p
                    style={{
                      fontSize:
                        "12px",
                      marginBottom:
                        "10px",
                      color:
                        "#616161"
                    }}
                  >
                    <span
                      style={{
                        fontWeight:
                          "700"
                      }}
                    >
                      Description:
                    </span>{" "}
                    {
                      project.description
                    }
                  </p>
                </p>
              </div>
            )
          )}
        </div>

        {/* RIGHT CONTENT */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection:
              "column",
            overflow:
              "hidden",
            background:
              "white"
          }}
        >

          {/* TOP DASHBOARD STATS */}
          <div
            style={{
              padding: "15px",
              borderBottom:
                "1px solid #ddd",
              display: "flex",
              gap: "12px",
              overflowX:
                "auto",
              background:
                "#f8f9fa"
            }}
          >
            <div
              style={cardStyle(
                "#FF6B35"
              )}
            >
              <h3
                style={{
                  fontSize:
                    "16px",
                  fontWeight:
                    "700",
                  color:
                    "#FFFFFF",
                  margin:
                    "0 0 5px 0"
                }}
              >
                Total Tasks
              </h3>

              <p
                style={{
                  fontSize:
                    "18px",
                  fontWeight:
                    "800",
                  color:
                    "#FFFFFF",
                  margin: 0
                }}
              >
                {stats.total ||
                  0}
              </p>
            </div>

            <div
              style={cardStyle(
                "#22C55E"
              )}
            >
              <h3
                style={{
                  fontSize:
                    "16px",
                  fontWeight:
                    "700",
                  color:
                    "#FFFFFF",
                  margin:
                    "0 0 5px 0"
                }}
              >
                Done
              </h3>

              <p
                style={{
                  fontSize:
                    "18px",
                  fontWeight:
                    "800",
                  color:
                    "#FFFFFF",
                  margin: 0
                }}
              >
                {stats.done ||
                  0}
              </p>
            </div>

            <div
              style={cardStyle(
                "#FACC15"
              )}
            >
              <h3
                style={{
                  fontSize:
                    "16px",
                  fontWeight:
                    "700",
                  color:
                    "#FFFFFF",
                  margin:
                    "0 0 5px 0"
                }}
              >
                Pending
              </h3>

              <p
                style={{
                  fontSize:
                    "18px",
                  fontWeight:
                    "800",
                  color:
                    "#FFFFFF",
                  margin: 0
                }}
              >
                {stats.pending ||
                  0}
              </p>
            </div>

            <div
              style={cardStyle(
                "#3B82F6"
              )}
            >
              <h3
                style={{
                  fontSize:
                    "16px",
                  fontWeight:
                    "700",
                  color:
                    "#FFFFFF",
                  margin:
                    "0 0 5px 0"
                }}
              >
                Underway
              </h3>

              <p
                style={{
                  fontSize:
                    "18px",
                  fontWeight:
                    "800",
                  color:
                    "#FFFFFF",
                  margin: 0
                }}
              >
                {stats.underway ||
                  0}
              </p>
            </div>

            <div
              style={cardStyle(
                "#FF3B30"
              )}
            >
              <h3
                style={{
                  fontSize:
                    "16px",
                  fontWeight:
                    "700",
                  color:
                    "#FFFFFF",
                  margin:
                    "0 0 5px 0"
                }}
              >
                Overdue
              </h3>

              <p
                style={{
                  fontSize:
                    "18px",
                  fontWeight:
                    "800",
                  color:
                    "#FFFFFF",
                  margin: 0
                }}
              >
                {stats.overdue ||
                  0}
              </p>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div
            style={{
              flex: 1,
              overflowY:
                "auto",
              padding: "15px"
            }}
          >

            {/* TASKS */}
            <div
              style={{
                border:
                  "1px solid #ddd",
                borderRadius:
                  "10px",
                padding:
                  "15px",
                background:
                  "white",
                borderTop:
                  "1px solid #ddd"
              }}
            >
              <h2
                style={{
                  fontSize:
                    "18px",
                  fontWeight:
                    "700",
                  marginBottom:
                    "15px",
                  marginTop: 0,
                  color:
                    "#222"
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
                    padding:
                      "40px 20px",
                    textAlign:
                      "center",
                    background:
                      "#f8f9fa",
                    fontSize:
                      "16px",
                    color:
                      "#999"
                  }}
                >
                  Select Project To
                  View Tasks
                </div>
              ) : tasks.length ===
                0 ? (
                <div
                  style={{
                    border:
                      "2px dashed #ddd",
                    borderRadius:
                      "10px",
                    padding:
                      "40px 20px",
                    textAlign:
                      "center",
                    background:
                      "#f8f9fa",
                    fontSize:
                      "16px",
                    color:
                      "#999"
                  }}
                >
                  No Tasks Found
                </div>
              ) : (
                <div
                  style={{
                    display:
                      "grid",
                    gridTemplateColumns:
                      "repeat(3, 1fr)",
                    gap: "15px"
                  }}
                >
                  {tasks.map(
                    (task) => {

                      const isOverdue =
                        task.dueDate &&
                        new Date(
                          task.dueDate
                        ) <
                        new Date() &&
                        task.status !==
                        "done";

                      const statusInfo =
                        getStatusColor(
                          isOverdue
                            ? "overdue"
                            : task.status
                        );

                      return (
                        <div
                          key={
                            task._id
                          }
                          style={{
                            border:
                              "1px solid #ddd",
                            borderRadius:
                              "10px",
                            padding:
                              "15px",
                            background:
                              "white"
                          }}
                        >
                          <h3
                            style={{
                              fontSize:
                                "16px",
                              fontWeight:
                                "700",
                              marginTop: 0,
                              marginBottom:
                                "12px",
                              marginLeft:
                                "-15px",
                              marginRight:
                                "-15px",
                              paddingLeft:
                                "15px",
                              paddingRight:
                                "15px",
                              paddingBottom:
                                "10px",
                              borderBottom:
                                "1px solid #ddd",
                              color:
                                "#222"
                            }}
                          >
                            {
                              task.title
                            }
                          </h3>

                          <p
                            style={{
                              fontSize:
                                "12px",
                              marginBottom:
                                "10px",
                              color:
                                "#666"
                            }}
                          >
                            <span
                              style={{
                                fontWeight:
                                  "600"
                              }}
                            >
                              Description:
                            </span>{" "}
                            {task.description ||
                              "No Description"}
                          </p>

                          <p
                            style={{
                              fontSize:
                                "12px",
                              marginBottom:
                                "12px",
                              color:
                                "#666"
                            }}
                          >
                            <span
                              style={{
                                fontWeight:
                                  "600"
                              }}
                            >
                              Due Date:
                            </span>{" "}
                            {task.dueDate
                              ? new Date(
                                task.dueDate
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  month:
                                    "short",
                                  day: "numeric",
                                  year:
                                    "numeric"
                                }
                              )
                              : "No Due Date"}
                          </p>

                          <div
                            style={{
                              display:
                                "block",
                              padding:
                                "6px 12px",
                              background:
                                statusInfo.bg,
                              color:
                                statusInfo.text,
                              borderRadius:
                                "6px",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                              marginBottom:
                                "10px",
                              textAlign:
                                "center"
                            }}
                          >
                            {
                              statusInfo.label
                            }
                          </div>

                          <div
                            style={{
                              display:
                                "flex",
                              gap: "8px",
                              flexWrap:
                                "wrap"
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
                                ...buttonStyle(
                                  "#F59E0B",
                                  "white"
                                ),
                                flex: 1,
                                fontSize:
                                  "12px"
                              }}
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
                                ...buttonStyle(
                                  "#22C55E",
                                  "white"
                                ),
                                flex: 1,
                                fontSize:
                                  "12px"
                              }}
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}