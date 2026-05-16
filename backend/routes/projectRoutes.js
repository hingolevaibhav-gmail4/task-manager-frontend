const express =
  require("express");

const router =
  express.Router();

const auth =
  require("../middleware/authMiddleware");

const role =
  require("../middleware/roleMiddleware");

const {
  createProject,
  getProjects,
  addMember,
  deleteProject
} = require(
  "../controllers/projectController"
);

// CREATE PROJECT
router.post(
  "/",
  auth,
  role(["admin"]),
  createProject
);

// GET PROJECTS
router.get(
  "/",
  auth,
  getProjects
);

// ADD MEMBER
router.put(
  "/add-member",
  auth,
  role(["admin"]),
  addMember
);

// DELETE PROJECT
router.delete(
  "/:id",
  auth,
  role(["admin"]),
  deleteProject
);

module.exports = router;