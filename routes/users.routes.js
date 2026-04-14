import { Router } from "express";

const router = Router();

/** Secuencia local: cada POST crea un recurso nuevo (comportamiento no idempotente). */
let nextSyntheticId = 10_000;

router.post("/", (req, res) => {
  const id = nextSyntheticId++;
  res.status(201).json({
    id,
    name: req.body?.name ?? "Anonymous",
    username: req.body?.username ?? `user_${id}`,
    email: req.body?.email ?? `user${id}@example.test`,
    message: "Recurso creado en este servidor (respuesta mockeada; cada POST obtiene un id distinto)."
  });
});

export default router;
