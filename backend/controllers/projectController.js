const Project = require("../models/Project");

const User = require("../models/User");

const Task = require("../models/Task");

// CREATE PROJECT
exports.createProject = async (
  req,
  res
) => {
  try {

    const {
      title,
      description
    } = req.body;

    const project =
      await Project.create({
        title,
        description,
        createdBy:
          req.user.id,

        members: [
          req.user.id
        ]
      });

    res.json(project);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

// GET PROJECTS
exports.getProjects = async (
  req,
  res
) => {
  try {

    const projects =
      await Project.find({
        members:
          req.user.id
      });

    res.json(projects);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

// ADD MEMBER
exports.addMember = async (
  req,
  res
) => {
  try {

    const {
      projectId,
      email
    } = req.body;

    // FIND USER
    const user =
      await User.findOne({
        email
      });

    if (!user) {
      return res.status(404).json({
        error:
          "User not found"
      });
    }

    // FIND PROJECT
    const project =
      await Project.findById(
        projectId
      );

    if (!project) {
      return res.status(404).json({
        error:
          "Project not found"
      });
    }

    // CHECK MEMBER ONLY INSIDE CURRENT PROJECT
    const alreadyMember =
      project.members.some(
        (memberId) =>
          memberId.toString() ===
          user._id.toString()
      );

    // PREVENT DUPLICATE IN SAME PROJECT
    if (alreadyMember) {
      return res.status(400).json({
        error:
          "Member already added to this project"
      });
    }

    // ADD MEMBER
    project.members.push(
      user._id
    );

    await project.save();

    res.json(project);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

// DELETE PROJECT
exports.deleteProject =
  async (req, res) => {
    try {

      const projectId =
        req.params.id;

      // DELETE ALL TASKS OF PROJECT
      await Task.deleteMany({
        projectId
      });

      // DELETE PROJECT
      await Project.findByIdAndDelete(
        projectId
      );

      res.json({
        message:
          "Project and tasks deleted successfully"
      });

    } catch (err) {

      res.status(400).json({
        error: err.message
      });
    }
  };