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

        const currentTask =
          tasks.find(
            (task) =>
              task._id ===
              editingTask
          );

        const isOverdue =
          dueDate &&
          new Date(dueDate) <
          new Date() &&
          currentTask?.status !==
          "done";

        await updateTask(
          token,
          editingTask,
          {
            title:
              taskTitle,

            description:
              taskDescription,

            dueDate,

            status:
              isOverdue
                ? "overdue"
                : currentTask?.status ||
                "pending"
          }
        );

        setTasks(
          tasks.map((task) =>
            task._id ===
              editingTask
              ? {
                ...task,
                title:
                  taskTitle,
                description:
                  taskDescription,
                dueDate:
                  dueDate,
                status:
                  isOverdue
                    ? "overdue"
                    : task.status
              }
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

  const cardStyle = (bgColor = "#fff") => ({
    flex: 1,
    border: "2px solid #e0e0e0",
    borderRadius: "10px",
    padding: "12px",
    background: bgColor,
    fontSize: "14px",
    textAlign: "center"
  });

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
      case "underway": return { bg: "#FFF3E0", text: "#CC6600", label: "→ Underway" };
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
          borderBottom: "2px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
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
          Admin Dashboard
        </h1>

        <button
          onClick={handleLogout}
          style={{...buttonStyle("#FF4444", "white")}}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
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
          background: "#e0e0e0"
        }}
      >

        {/* LEFT SIDEBAR */}
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
              width: "100%",
              padding: "12px",
              fontSize: "14px",
              marginBottom: "10px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#222"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
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
              width: "100%",
              padding: "12px",
              fontSize: "14px",
              marginBottom: "10px",
              minHeight: "70px",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              outline: "none",
              resize: "vertical",
              fontFamily: "inherit"
            }}
            onFocus={(e) => e.target.style.borderColor = "#222"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />

          <button
            onClick={
              handleCreateProject
            }
            style={{
              ...buttonStyle("#28A745", "white"),
              width: "100%",
              marginBottom: "15px"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            + Create Project
          </button>

          {projects.map(
            (project) => (
              <div
                key={project._id}
                style={{
                  border: "2px solid #ddd",
                  borderRadius: "10px",
                  padding: "12px",
                  marginBottom: "10px",
                  background: selectedProject === project._id ? "#f0f0f0" : "white",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
              >
                <div
                  onClick={() =>
                    loadTasks(
                      project._id
                    )
                  }
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      marginBottom: "5px",
                      color: "#222"
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    style={{
                      fontSize: "13px",
                      margin: 0,
                      color: "#666"
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
                    gap: "8px",
                    marginTop: "10px",
                    flexWrap: "wrap"
                  }}
                >
                  <button
                    onClick={() => {
                      if (selectedProject !== project._id) {
                        alert("Please select the project first to check its tasks");
                        return;
                      }

                      const allDone = tasks.length > 0 && tasks.every(task => task.status === "done");

                      if (tasks.length === 0) {
                        alert("No tasks in this project");
                      } else if (!allDone) {
                        const incompleteTasks = tasks.filter(task => task.status !== "done").length;
                        alert(`Cannot mark project as done. ${incompleteTasks} task(s) still pending.`);
                      } else {
                        alert("Project marked as done!");
                      }
                    }}
                    style={{...buttonStyle("#28A745", "white"), flex: 1}}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-3px)";
                      e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Done
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteProject(
                        project._id
                      )
                    }
                    style={{...buttonStyle("#FF4444", "white"), flex: 1}}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-3px)";
                      e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
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
            flexDirection: "column",
            overflow: "hidden",
            background: "white"
          }}
        >

          {/* TOP DASHBOARD STATS */}
          <div
            style={{
              padding: "15px",
              borderBottom: "2px solid #e0e0e0",
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              background: "#f8f9fa"
            }}
          >
            <div style={cardStyle("#FFE8D6")}>
              <h3 style={{fontSize: "12px", fontWeight: "700", color: "#222", margin: "0 0 5px 0"}}>Total tasks</h3>
              <p style={{fontSize: "24px", fontWeight: "700", color: "#FF9800", margin: 0}}>
                {stats.total || 0}
              </p>
            </div>

            <div style={cardStyle("#E8F5E9")}>
              <h3 style={{fontSize: "12px", fontWeight: "700", color: "#222", margin: "0 0 5px 0"}}>Done</h3>
              <p style={{fontSize: "24px", fontWeight: "700", color: "#28A745", margin: 0}}>
                {stats.done || 0}
              </p>
            </div>

            <div style={cardStyle("#FFFDE7")}>
              <h3 style={{fontSize: "12px", fontWeight: "700", color: "#222", margin: "0 0 5px 0"}}>Pending</h3>
              <p style={{fontSize: "24px", fontWeight: "700", color: "#B8860B", margin: 0}}>
                {stats.pending || 0}
              </p>
            </div>

            <div style={cardStyle("#E3F2FD")}>
              <h3 style={{fontSize: "12px", fontWeight: "700", color: "#222", margin: "0 0 5px 0"}}>Underway</h3>
              <p style={{fontSize: "24px", fontWeight: "700", color: "#007BFF", margin: 0}}>
                {stats.underway || 0}
              </p>
            </div>

            <div style={cardStyle("#FFEBEE")}>
              <h3 style={{fontSize: "12px", fontWeight: "700", color: "#222", margin: "0 0 5px 0"}}>Overdue</h3>
              <p style={{fontSize: "24px", fontWeight: "700", color: "#FF4444", margin: 0}}>
                {stats.overdue || 0}
              </p>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "15px"
            }}
          >

            {selectedProject && (
              <>
                {/* ADD MEMBER */}
                <div
                  style={{
                    border: "2px solid #e0e0e0",
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "15px",
                    background: "white"
                  }}
                >
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "15px",
                      color: "#222"
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
                      width: "100%",
                      padding: "12px",
                      fontSize: "14px",
                      marginBottom: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#222"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  />

                  <button
                    onClick={
                      handleAddMember
                    }
                    style={{...buttonStyle("#28A745", "white")}}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-3px)";
                      e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    + Add Member
                  </button>
                </div>

                {/* CREATE TASK */}
                <div
                  style={{
                    border: "2px solid #e0e0e0",
                    borderRadius: "10px",
                    padding: "15px",
                    marginBottom: "15px",
                    background: "white"
                  }}
                >
                  <h2
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      marginBottom: "15px",
                      color: "#222"
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
                      width: "100%",
                      padding: "12px",
                      fontSize: "14px",
                      marginBottom: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#222"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
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
                      width: "100%",
                      padding: "12px",
                      fontSize: "14px",
                      marginBottom: "12px",
                      minHeight: "80px",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none",
                      resize: "vertical",
                      fontFamily: "inherit"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#222"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
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
                      width: "100%",
                      padding: "12px",
                      fontSize: "14px",
                      marginBottom: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#222"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
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
                      width: "100%",
                      padding: "12px",
                      fontSize: "14px",
                      marginBottom: "12px",
                      borderRadius: "8px",
                      border: "2px solid #e0e0e0",
                      outline: "none"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#222"}
                    onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
                  />

                  <button
                    onClick={
                      handleCreateTask
                    }
                    style={{...buttonStyle("#28A745", "white"), width: "100%"}}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "translateY(-3px)";
                      e.target.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    {editingTask
                      ? "Update Task"
                      : "Assign Task"}
                  </button>
                </div>

                {/* TASKS */}
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
                      color: "#222"
                    }}
                  >
                    Tasks
                  </h2>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "15px"
                    }}
                  >
                    {tasks.length === 0 ? (
                      <div
                        style={{
                          gridColumn: "1 / -1",
                          border: "2px dashed #ddd",
                          borderRadius: "10px",
                          padding: "40px 20px",
                          textAlign: "center",
                          background: "#f8f9fa",
                          fontSize: "16px",
                          color: "#999"
                        }}
                      >
                        No Tasks Added
                      </div>
                    ) : (
                      tasks.map((task) => {

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
                              background: "white"
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
                              <span style={{fontWeight: "600"}}>Description:</span> {task.description ||
                                "No Description"}
                            </p>

                            <p
                              style={{
                                fontSize: "13px",
                                marginBottom: "8px",
                                color: "#666"
                              }}
                            >
                              <span style={{fontWeight: "600"}}>Assigned To:</span> {task.assignedTo?.email ||
                                "Unassigned"}
                            </p>

                            <p
                              style={{
                                fontSize: "13px",
                                marginBottom: "12px",
                                color: "#666"
                              }}
                            >
                              <span style={{fontWeight: "600"}}>Due Date:</span> {task.dueDate
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
                                display: "block",
                                padding: "6px 12px",
                                background: statusInfo.bg,
                                color: statusInfo.text,
                                borderRadius: "6px",
                                fontSize: "13px",
                                fontWeight: "600",
                                marginBottom: "10px",
                                textAlign: "center"
                              }}
                            >
                              {statusInfo.label}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap"
                              }}
                            >
                              <button
                                onClick={() =>
                                  handleEditTask(
                                    task
                                  )
                                }
                                style={{
                                  ...buttonStyle("#007BFF", "white"),
                                  flex: 1,
                                  fontSize: "12px"
                                }}
                                onMouseEnter={(e) => e.target.style.background = "#0056b3"}
                                onMouseLeave={(e) => e.target.style.background = "#007BFF"}
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  handleDone(
                                    task._id
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

                              <button
                                onClick={() =>
                                  handleDelete(
                                    task._id
                                  )
                                }
                                style={{
                                  ...buttonStyle("#FF4444", "white"),
                                  flex: 1,
                                  fontSize: "12px"
                                }}
                                onMouseEnter={(e) => e.target.style.background = "#CC0000"}
                                onMouseLeave={(e) => e.target.style.background = "#FF4444"}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })
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