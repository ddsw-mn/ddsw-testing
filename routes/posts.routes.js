import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json([
    { id: 1, title: "Mock post 1", userId: 1 },
    { id: 2, title: "Mock post 2", userId: 1 }
  ]);
});

router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  res.status(200).json({ id, title: `Mock post ${id}`, body: "Lorem ipsum", userId: 1 });
});

export default router;
