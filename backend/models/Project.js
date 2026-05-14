const mongoose =
  require("mongoose");

const projectSchema =
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

      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "User"
      },

      members: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],

      completed: {
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: true
    }
  );

module.exports =
  mongoose.model(
    "Project",
    projectSchema
  );