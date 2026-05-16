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
  deleteProject,
  getMembers
} = require(
  "../controllers/projectController"
);

// CREATE PROJECT
router.post(
  "/",
  auth,
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
  addMember
);

// DELETE PROJECT
router.delete(
  "/:id",
  auth,
  deleteProject
);

// GET MEMBERS
router.get(
  "/:id/members",
  auth,
  getMembers
);

module.exports = router;
