import express from "express";
import Controller from "../controllers/controller.js";
import postsRoutes from "./posts.routes.js";

const routes = express();

routes.use(express.json());

routes.get("/assignments", (req, res, next) => {
  Controller.getUsersAssignments(req, res, next);
});

routes.get("/assignments/:userId", (req, res, next) => {
  Controller.getUserAssignment(req, res, next);
});

routes.use("/posts", postsRoutes);

routes.use((err, req, res, next) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: "ValidationError",
      details: err.errors
    });
  }
  const upstreamStatus = err?.response?.status;
  res.status(upstreamStatus || 502).json({
    error: err.name || "Error",
    message: err.message
  });
});

export default routes;
