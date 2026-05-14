const API =
  "https://task-manager-backend-production-247a.up.railway.app/api";

// LOGIN
export async function loginUser(
  data
) {
  const res = await fetch(
    `${API}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(
        data
      )
    }
  );

  return res.json();
}

// SIGNUP
export async function signupUser(
  data
) {
  const res = await fetch(
    `${API}/auth/signup`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify(
        data
      )
    }
  );

  return res.json();
}

// GET PROJECTS
export async function getProjects(
  token
) {
  const res = await fetch(
    `${API}/projects`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return res.json();
}

// CREATE PROJECT
export async function createProject(
  token,
  data
) {
  const res = await fetch(
    `${API}/projects`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(
        data
      )
    }
  );

  return res.json();
}

// DELETE PROJECT
export async function deleteProject(
  token,
  id
) {
  const res = await fetch(
    `${API}/projects/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return res.json();
}

// ADD MEMBER
export async function addMember(
  token,
  data
) {
  const res = await fetch(
    `${API}/projects/add-member`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(
        data
      )
    }
  );

  return res.json();
}

// GET TASKS
export async function getTasks(
  token,
  projectId
) {
  const res = await fetch(
    `${API}/tasks/project/${projectId}`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return res.json();
}

// CREATE TASK
export async function createTask(
  token,
  data
) {
  const res = await fetch(
    `${API}/tasks`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(
        data
      )
    }
  );

  return res.json();
}

// UPDATE TASK
export async function updateTask(
  token,
  id,
  data
) {
  const res = await fetch(
    `${API}/tasks/${id}`,
    {
      method: "PUT",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`
      },

      body: JSON.stringify(
        data
      )
    }
  );

  return res.json();
}

// DELETE TASK
export async function deleteTask(
  token,
  id
) {
  const res = await fetch(
    `${API}/tasks/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return res.json();
}

// DASHBOARD
export async function getDashboard(
  token
) {
  const res = await fetch(
    `${API}/tasks/dashboard`,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  return res.json();
}