const express = require("express");

const router = express.Router();

const auth =
  require("../middleware/authMiddleware");

const role =
  require("../middleware/roleMiddleware");

const {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  deleteTask,
  getDashboard
} = require(
  "../controllers/taskController"
);

// CREATE TASK
router.post(
  "/",
  auth,
  role(["admin"]),
  createTask
);

// GET TASKS BY PROJECT
router.get(
  "/project/:projectId",
  auth,
  getTasksByProject
);

// UPDATE TASK STATUS
router.put(
  "/:id",
  auth,
  updateTaskStatus
);

// DELETE TASK
router.delete(
  "/:id",
  auth,
  role(["admin"]),
  deleteTask
);

// DASHBOARD
router.get(
  "/dashboard",
  auth,
  getDashboard
);

module.exports = router;