const Task =
  require("../models/Task");

const User =
  require("../models/User");

const Project =
  require("../models/Project");

// CREATE TASK
exports.createTask =
  async (req, res) => {
    try {

      const {
        title,
        description,
        projectId,
        assignedEmail,
        dueDate
      } = req.body;

      const user =
        await User.findOne({
          email:
            assignedEmail
        });

      if (!user) {
        return res.status(404).json({
          error:
            "User not found"
        });
      }

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

      const isMember =
        project.members.some(
          (memberId) =>
            memberId.toString() ===
            user._id.toString()
        );

      if (!isMember) {
        return res.status(400).json({
          error:
            "Please add member to project first"
        });
      }

      const task =
        await Task.create({
          title,
          description,
          projectId,

          assignedTo:
            user._id,

          dueDate
        });

      const populated =
        await Task.findById(
          task._id
        ).populate(
          "assignedTo",
          "name email"
        );

      res.json(populated);

    } catch (err) {

      res.status(400).json({
        error: err.message
      });
    }
  };

// GET TASKS
exports.getTasksByProject =
  async (req, res) => {
    try {

      let tasks = [];

      if (
        req.user.role ===
        "admin"
      ) {

        tasks =
          await Task.find({
            projectId:
              req.params
                .projectId
          }).populate(
            "assignedTo",
            "name email"
          );

      } else {

        tasks =
          await Task.find({
            projectId:
              req.params
                .projectId,

            assignedTo:
              req.user.id
          }).populate(
            "assignedTo",
            "name email"
          );
      }

      res.json(tasks);

    } catch (err) {

      res.status(400).json({
        error: err.message
      });
    }
  };

// UPDATE TASK
exports.updateTaskStatus =
  async (req, res) => {
    try {

      const existingTask =
        await Task.findById(
          req.params.id
        );

      if (!existingTask) {
        return res.status(404).json({
          error:
            "Task not found"
        });
      }

      existingTask.title =
        req.body.title ??
        existingTask.title;

      existingTask.description =
        req.body.description ??
        existingTask.description;

      existingTask.status =
        req.body.status ??
        existingTask.status;

      existingTask.dueDate =
        req.body.dueDate ??
        existingTask.dueDate;

      await existingTask.save();

      const populated =
        await Task.findById(
          existingTask._id
        ).populate(
          "assignedTo",
          "name email"
        );

      res.json(populated);

    } catch (err) {

      res.status(400).json({
        error: err.message
      });
    }
  };

// DELETE TASK
exports.deleteTask =
  async (req, res) => {
    try {

      await Task.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Task deleted"
      });

    } catch (err) {

      res.status(400).json({
        error: err.message
      });
    }
  };

// DASHBOARD
exports.getDashboard =
  async (req, res) => {
    try {

      let tasks = [];

      if (
        req.user.role ===
        "admin"
      ) {

        tasks =
          await Task.find();

      } else {

        tasks =
          await Task.find({
            assignedTo:
              req.user.id
          });
      }

      const now =
        new Date();

      const overdue =
        tasks.filter(
          (task) =>
            task.dueDate &&
            new Date(
              task.dueDate
            ) < now &&
            task.status !==
            "done"
        ).length;

      res.json({
        total:
          tasks.length,

        done:
          tasks.filter(
            (t) =>
              t.status ===
              "done"
          ).length,

        pending:
          tasks.filter(
            (t) =>
              t.status ===
              "pending"
          ).length,

        underway:
          tasks.filter(
            (t) =>
              t.status ===
              "underway"
          ).length,

        overdue
      });

    } catch (err) {

      res.status(400).json({
        error: err.message
      });
    }
  };