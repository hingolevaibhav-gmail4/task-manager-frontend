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

          dueDate,

          status:
            "pending"
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
        error:
          err.message
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
        error:
          err.message
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
        error:
          err.message
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
        error:
          err.message
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

      // DONE
      const done =
        tasks.filter(
          (task) =>
            task.status ===
            "done"
        ).length;

      // OVERDUE
      const overdue =
        tasks.filter(
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

      // PENDING
      const pending =
        tasks.filter(
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

      // UNDERWAY
      const underway =
        tasks.filter(
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

      res.json({
        total:
          tasks.length,

        done,

        pending,

        underway,

        overdue
      });

    } catch (err) {

      res.status(400).json({
        error:
          err.message
      });
    }
  };