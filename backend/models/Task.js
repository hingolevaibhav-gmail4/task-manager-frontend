const mongoose =
  require("mongoose");

const taskSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true
      },

      description: {
        type: String,
        default: ""
      },

      projectId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
      },

      assignedTo: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      status: {
        type: String,
        enum: [
          "pending",
          "underway",
          "done"
        ],
        default: "pending"
      },

      dueDate: {
        type: Date
      }
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "Task",
    taskSchema
  );