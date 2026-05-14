import {
  useEffect,
  useState,
  useCallback
} from "react";

import {
  getProjects,
  createProject,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteProject,
  addMember,
  getDashboard
} from "../services/api";

export default function AdminDashboard({
  token,
  setToken
}) {

  const [projects, setProjects] =
    useState([]);

  const [
    selectedProject,
    setSelectedProject
  ] = useState(null);

  const [tasks, setTasks] =
    useState([]);

  const [stats, setStats] =
    useState({});

  const [projectTitle, setProjectTitle] =
    useState("");

  const [
    projectDescription,
    setProjectDescription
  ] = useState("");

  const [memberEmail, setMemberEmail] =
    useState("");

  const [taskTitle, setTaskTitle] =
    useState("");

  const [
    taskDescription,
    setTaskDescription
  ] = useState("");

  const [assignEmail, setAssignEmail] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [editingTask, setEditingTask] =
    useState(null);

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

  const loadDashboard =
    useCallback(async () => {

      const data =
        await getDashboard(token);

      setStats(data || {});

    }, [token]);

  useEffect(() => {
    loadProjects();
    loadDashboard();
  }, [
    loadProjects,
    loadDashboard
  ]);

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

  const handleCreateProject =
    async () => {

      if (!projectTitle) {
        alert(
          "Enter project title"
        );
        return;
      }

      const res =
        await createProject(
          token,
          {
            title:
              projectTitle,

            description:
              projectDescription
          }
        );

      if (res._id) {

        setProjects([
          ...projects,
          res
        ]);

        setProjectTitle("");

        setProjectDescription("");

      } else {

        alert(
          res.error ||
          "Project creation failed"
        );
      }
    };

  const handleDeleteProject =
    async (id) => {

      await deleteProject(
        token,
        id
      );

      setProjects(
        projects.filter(
          (project) =>
            project._id !== id
        )
      );

      setTasks(
        tasks.filter(
          (task) =>
            task.projectId !== id
        )
      );

      if (
        selectedProject === id
      ) {

        setSelectedProject(
          null
        );

        setTasks([]);
      }

      loadDashboard();
    };

  const handleAddMember =
    async () => {

      if (
        !memberEmail ||
        !selectedProject
      ) {
        alert(
          "Enter member email"
        );
        return;
      }

      const res =
        await addMember(
          token,
          {
            projectId:
              selectedProject,

            email:
              memberEmail
          }
        );

      if (res._id) {

        alert(
          "Member added successfully"
        );

        setMemberEmail("");

      } else {

        alert(
          res.error ||
          "Failed to add member"
        );
      }
    };

  const handleEditTask =
    (task) => {

      setEditingTask(
        task._id
      );

      setTaskTitle(
        task.title
      );

      setTaskDescription(
        task.description
      );

      setAssignEmail(
        task.assignedTo
          ?.email || ""
      );

      setDueDate(
        task.dueDate
          ? new Date(
            task.dueDate
          )
            .toISOString()
            .split("T")[0]
          : ""
      );
    };

  const handleCreateTask =
    async () => {

      if (
        !taskTitle ||
        !assignEmail
      ) {
        alert(
          "Fill all fields"
        );
        return;
      }

      if (editingTask) {

        const res =
          await updateTask(
            token,
            editingTask,
            {
              title:
                taskTitle,

              description:
                taskDescription,

              dueDate
            }
          );

        setTasks(
          tasks.map((task) =>
            task._id ===
              editingTask
              ? res
              : task
          )
        );

        setEditingTask(
          null
        );

      } else {

        const res =
          await createTask(
            token,
            {
              title:
                taskTitle,

              description:
                taskDescription,

              projectId:
                selectedProject,

              assignedEmail:
                assignEmail,

              dueDate
            }
          );

        if (res._id) {

          setTasks([
            ...tasks,
            res
          ]);

        } else {

          alert(
            res.error ||
            "Task creation failed"
          );

          return;
        }
      }

      setTaskTitle("");
      setTaskDescription("");
      setAssignEmail("");
      setDueDate("");

      loadDashboard();
    };

  const handleDone =
    async (id) => {

      const res =
        await updateTask(
          token,
          id,
          {
            status:
              "done"
          }
        );

      setTasks(
        tasks.map((task) =>
          task._id === id
            ? res
            : task
        )
      );

      loadDashboard();
    };

  const handleDelete =
    async (id) => {

      await deleteTask(
        token,
        id
      );

      setTasks(
        tasks.filter(
          (task) =>
            task._id !== id
        )
      );

      loadDashboard();
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

  const cardStyle = {
    minWidth: "85px",
    border: "1px solid #e5e5e5",
    borderRadius: "8px",
    padding: "8px",
    background: "#fff",
    fontSize: "10px"
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
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
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

        {/* LEFT SIDEBAR */}
        <div
          style={{
            width: "200px",
            borderRight:
              "1px solid #ddd",
            padding: "10px",
            overflowY: "auto",
            background: "#fafafa"
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              marginBottom: "10px"
            }}
          >
            <h2
              style={{
                fontSize: "13px"
              }}
            >
              Projects
            </h2>
          </div>

          <input
            type="text"
            placeholder="Project Title"
            value={projectTitle}
            onChange={(e) =>
              setProjectTitle(
                e.target.value
              )
            }
            style={{
              width: "calc(100% - 14px)",
              padding: "6px",
              fontSize: "10px",
              marginBottom:
                "6px",
              borderRadius:
                "5px",
              border:
                "1px solid #ccc"
            }}
          />

          <textarea
            placeholder="Project Description"
            value={
              projectDescription
            }
            onChange={(e) =>
              setProjectDescription(
                e.target.value
              )
            }
            style={{
              width: "calc(100% - 14px)",
              padding: "6px",
              fontSize: "10px",
              marginBottom:
                "6px",
              minHeight: "55px",
              borderRadius:
                "5px",
              border:
                "1px solid #ccc"
            }}
          />

          <button
            onClick={
              handleCreateProject
            }
            style={{
              ...buttonStyle,
              width: "100%",
              marginBottom:
                "10px"
            }}
          >
            Create
          </button>

          {projects.map(
            (project) => (
              <div
                key={project._id}
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius:
                    "6px",
                  padding: "8px",
                  marginBottom:
                    "6px",
                  background:
                    selectedProject ===
                      project._id
                      ? "#eef4ff"
                      : "white"
                }}
              >
                <div
                  onClick={() =>
                    loadTasks(
                      project._id
                    )
                  }
                  style={{
                    cursor:
                      "pointer"
                  }}
                >
                  <h3
                    style={{
                      fontSize:
                        "11px",
                      marginBottom:
                        "3px"
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    style={{
                      fontSize:
                        "10px"
                    }}
                  >
                    {
                      project.description
                    }
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginTop: "6px",
                    flexWrap: "wrap"
                  }}
                >
                  <button
                    style={buttonStyle}
                  >
                    Project Completed
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProject(
                        project._id
                      )
                    }
                    style={buttonStyle}
                  >
                    Delete
                  </button>
                </div>
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
            overflow: "hidden"
          }}
        >

          {/* TOP DASHBOARD */}
          <div
            style={{
              padding: "8px",
              borderBottom:
                "1px solid #ddd",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              background: "white"
            }}
          >
            <div style={cardStyle}>
              <h3>Total</h3>
              <p>
                {stats.total || 0}
              </p>
            </div>

            <div style={cardStyle}>
              <h3>Done</h3>
              <p>
                {stats.done || 0}
              </p>
            </div>

            <div style={cardStyle}>
              <h3>Pending</h3>
              <p>
                {stats.pending || 0}
              </p>
            </div>

            <div style={cardStyle}>
              <h3>Underway</h3>
              <p>
                {stats.underway || 0}
              </p>
            </div>

            <div style={cardStyle}>
              <h3>Overdue</h3>
              <p>
                {stats.overdue || 0}
              </p>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "10px"
            }}
          >

            {selectedProject && (
              <>
                {/* ADD MEMBER */}
                <div
                  style={{
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "6px",
                    padding: "12px",
                    marginBottom:
                      "10px",
                    background:
                      "white"
                  }}
                >
                  <h2
                    style={{
                      fontSize:
                        "13px",
                      marginBottom:
                        "8px"
                    }}
                  >
                    Add Member
                  </h2>

                  <input
                    type="email"
                    placeholder="Member Email"
                    value={
                      memberEmail
                    }
                    onChange={(e) =>
                      setMemberEmail(
                        e.target.value
                      )
                    }
                    style={{
                      width:
                        "calc(100% - 14px)",
                      padding:
                        "6px",
                      fontSize:
                        "10px",
                      marginBottom:
                        "8px",
                      borderRadius:
                        "5px",
                      border:
                        "1px solid #ccc"
                    }}
                  />

                  <button
                    onClick={
                      handleAddMember
                    }
                    style={buttonStyle}
                  >
                    Add
                  </button>
                </div>

                {/* CREATE TASK */}
                <div
                  style={{
                    border:
                      "1px solid #ddd",
                    borderRadius:
                      "6px",
                    padding: "12px",
                    marginBottom:
                      "10px",
                    background:
                      "white"
                  }}
                >
                  <h2
                    style={{
                      fontSize:
                        "13px",
                      marginBottom:
                        "8px"
                    }}
                  >
                    {editingTask
                      ? "Update Task"
                      : "Create Task"}
                  </h2>

                  <input
                    type="text"
                    placeholder="Task Title"
                    value={taskTitle}
                    onChange={(e) =>
                      setTaskTitle(
                        e.target.value
                      )
                    }
                    style={{
                      width:
                        "calc(100% - 14px)",
                      padding: "6px",
                      fontSize: "10px",
                      marginBottom:
                        "8px",
                      borderRadius:
                        "5px",
                      border:
                        "1px solid #ccc"
                    }}
                  />

                  <textarea
                    placeholder="Task Description"
                    value={
                      taskDescription
                    }
                    onChange={(e) =>
                      setTaskDescription(
                        e.target.value
                      )
                    }
                    style={{
                      width:
                        "calc(100% - 14px)",
                      padding: "6px",
                      fontSize: "10px",
                      marginBottom:
                        "8px",
                      borderRadius:
                        "5px",
                      border:
                        "1px solid #ccc"
                    }}
                  />

                  <input
                    type="email"
                    placeholder="Assign Member Email"
                    value={assignEmail}
                    onChange={(e) =>
                      setAssignEmail(
                        e.target.value
                      )
                    }
                    style={{
                      width:
                        "calc(100% - 14px)",
                      padding: "6px",
                      fontSize: "10px",
                      marginBottom:
                        "8px",
                      borderRadius:
                        "5px",
                      border:
                        "1px solid #ccc"
                    }}
                  />

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(
                        e.target.value
                      )
                    }
                    style={{
                      width:
                        "calc(100% - 14px)",
                      padding: "6px",
                      fontSize: "10px",
                      marginBottom:
                        "8px",
                      borderRadius:
                        "5px",
                      border:
                        "1px solid #ccc"
                    }}
                  />

                  <button
                    onClick={
                      handleCreateTask
                    }
                    style={buttonStyle}
                  >
                    {editingTask
                      ? "Update"
                      : "Assign"}
                  </button>
                </div>

                {/* TASKS */}
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

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, 1fr)",
                      gap: "8px"
                    }}
                  >
                    {tasks.length === 0 ? (
                      <div
                        style={{
                          gridColumn: "1 / -1",
                          border:
                            "1px solid #ddd",
                          borderRadius:
                            "6px",
                          padding: "20px",
                          textAlign:
                            "center",
                          background:
                            "#fff",
                          fontSize:
                            "11px",
                          color: "#777"
                        }}
                      >
                        No Tasks Added
                      </div>
                    ) : (
                      tasks.map(
                        (task) => (
                          <div
                            key={task._id}
                            style={{
                              border:
                                "1px solid #ddd",
                              borderRadius:
                                "6px",
                              padding:
                                "8px",
                              background:
                                "white"
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
                              {task.title}
                            </h3>

                            <p
                              style={{
                                fontSize: "10px",
                                marginBottom: "6px",
                                color: "#222"
                              }}
                            >
                              Description:{" "}
                              {task.description || "No Description"}
                            </p>

                            <p>
                              User:{" "}
                              {task.assignedTo
                                ?.email ||
                                "No User"}
                            </p>

                            <p>
                              Status:{" "}
                              {task.status}
                            </p>

                            <p>
                              Due Date:{" "}
                              {task.dueDate
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
                                display:
                                  "flex",
                                gap: "6px",
                                marginTop:
                                  "6px",
                                flexWrap:
                                  "wrap"
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleEditTask(
                                    task
                                  )
                                }
                                style={
                                  buttonStyle
                                }
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDone(
                                    task._id
                                  )
                                }
                                style={
                                  buttonStyle
                                }
                              >
                                Done
                              </button>

                              <button
                                onClick={() =>
                                  handleDelete(
                                    task._id
                                  )
                                }
                                style={
                                  buttonStyle
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}