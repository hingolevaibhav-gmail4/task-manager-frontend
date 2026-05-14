const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");

const projectRoutes = require("./routes/projectRoutes");

const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  });

app.use("/api/auth", authRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/tasks", taskRoutes);

app.listen(5000, () => {
  console.log("Server Running");
});