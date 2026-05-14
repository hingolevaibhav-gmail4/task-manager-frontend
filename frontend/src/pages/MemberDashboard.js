import {
  useEffect,
  useState
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

  const loadProjects = async () => {

    const data =
      await getProjects(token);

    setProjects(
      Array.isArray(data)
        ? data
        : []
    );
  };

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

  const buttonStyle = {
    padding: "4px 8px",
    fontSize: "10px",
    borderRadius: "5px",
    cursor: "pointer",
    border: "1px solid #000",
    background: "white"
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily:
          "Inter, Arial",
        fontSize: "11px",
        color: "#222",
        overflow: "hidden"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          height: "50px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          background: "#ffffff",
          flexShrink: 0
        }}
      >
        <h1
          style={{
            fontSize: "15px",
            fontWeight: "600",
            margin: 0
          }}
        >
          Member Dashboard
        </h1>

        <button
          onClick={
            handleLogout
          }
          style={buttonStyle}
        >
          Logout
        </button>
      </div>

      {/* BODY */}
      <div
        style={{
          display: "flex",
          flex: 1,
          overflow: "hidden"
        }}
      >

        {/* LEFT PROJECT SECTION */}
        <div
          style={{
            width: "260px",
            borderRight:
              "1px solid #ddd",
            padding: "10px",
            overflowY: "auto",
            background: "#fafafa"
          }}
        >
          <h2
            style={{
              fontSize: "13px",
              marginBottom: "10px"
            }}
          >
            Projects
          </h2>

          {projects.length ===
            0 && (
              <div
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "6px",
                  padding: "12px",
                  background:
                    "white",
                  textAlign:
                    "center"
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
                    "1px solid #ddd",
                  borderRadius:
                    "6px",
                  padding:
                    "10px",
                  marginBottom:
                    "8px",
                  background:
                    selectedProject ===
                      project._id
                      ? "#eef4ff"
                      : "white",
                  cursor:
                    "pointer"
                }}
              >
                <h3
                  style={{
                    fontSize:
                      "11px",
                    marginBottom:
                      "4px"
                  }}
                >
                  {
                    project.title
                  }
                </h3>

                <p
                  style={{
                    fontSize:
                      "10px",
                    margin: 0
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
            padding: "10px",
            overflowY: "auto",
            background:
              "#fff"
          }}
        >
          <div
            style={{
              border:
                "1px solid #ddd",
              borderRadius:
                "6px",
              padding: "12px",
              background:
                "white"
            }}
          >
            <h2
              style={{
                fontSize:
                  "13px",
                marginBottom:
                  "10px"
              }}
            >
              Tasks
            </h2>

            {!selectedProject ? (
              <div
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "6px",
                  padding: "20px",
                  textAlign:
                    "center",
                  fontSize:
                    "11px"
                }}
              >
                Select Project To View Tasks
              </div>
            ) : tasks.length ===
              0 ? (
              <div
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "6px",
                  padding: "20px",
                  textAlign:
                    "center",
                  fontSize:
                    "11px"
                }}
              >
                No Tasks Found
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(2, 1fr)",
                  gap: "8px"
                }}
              >
                {tasks.map(
                  (task) => {

                    const isOverdue =
                      task.dueDate &&
                      new Date(
                        task.dueDate
                      ) < new Date() &&
                      task.status !==
                      "done";

                    return (
                      <div
                        key={
                          task._id
                        }
                        style={{
                          border:
                            "1px solid #ddd",
                          borderRadius:
                            "6px",
                          padding:
                            "10px",
                          background:
                            "white"
                        }}
                      >
                        <h3
                          style={{
                            fontSize:
                              "11px",
                            marginBottom:
                              "5px"
                          }}
                        >
                          {
                            task.title
                          }
                        </h3>

                        <p
                          style={{
                            fontSize:
                              "10px",
                            marginBottom:
                              "6px",
                            color:
                              "#222"
                          }}
                        >
                          Description:
                          {" "}
                          {task.description ||
                            "No Description"}
                        </p>

                        <p>
                          Status:
                          {" "}
                          {task.status ===
                            "underway"
                            ? "Underway"
                            : task.status ===
                              "done"
                              ? "Done"
                              : "Pending"}
                        </p>

                        <p>
                          Due:
                          {" "}
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
                            : "No Date"}
                        </p>

                        {isOverdue && (
                          <p
                            style={{
                              color:
                                "red",
                              marginBottom:
                                "6px"
                            }}
                          >
                            Overdue Task
                          </p>
                        )}

                        <div
                          style={{
                            display:
                              "flex",
                            gap: "6px",
                            marginTop:
                              "8px",
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
                            style={
                              buttonStyle
                            }
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
                            style={
                              buttonStyle
                            }
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
  );
}