import express from "express";
import Controller from "../controllers/controller.js";
import postsRoutes from "./posts.routes.js";
import usersRoutes from "./users.routes.js";

const routes = express();

routes.use(express.json());

routes.get("/assignments", (req, res, next) => {
  Controller.getUsersAssignments(req, res, next);
});

routes.get("/assignments/:userId", (req, res, next) => {
  Controller.getUserAssignment(req, res, next);
});

routes.use("/posts", postsRoutes);

routes.use("/users", usersRoutes);

/**
 * Simula dependencia caída: respuesta cruda (no JSON), sin pasar por el formateador de errores,
 * con cabeceras para que intermediarios/clientes no guarden la respuesta en caché.
 */
routes.get("/dependency-down", (req, res) => {
  res.writeHead(503, {
    "Cache-Control": "no-store, no-cache, must-revalidate, private",
    Pragma: "no-cache",
    Expires: "0",
    "Content-Type": "text/plain; charset=utf-8"
  });
  res.end("503 Service Unavailable\n");
});

/**
 * Simula fallo de dependencia con cuerpo JSON estructurado y mensaje descriptivo (vía middleware de errores).
 */
routes.get("/dependency-up", (req, res, next) => {
  const descriptiveMessage =
    "La verificación de disponibilidad del servicio aguas arriba falló: tras 3 intentos consecutivos el endpoint de salud respondió con latencia fuera de umbral o con un payload inválido, por lo que no se pudo considerar la dependencia como operativa.";
  const err = new Error(descriptiveMessage);
  err.status = 503;
  err.structured = {
    code: "DEPENDENCY_HEALTH_CHECK_FAILED",
    title: "Dependencia no disponible",
    message: descriptiveMessage,
    severity: "high",
    details: {
      dependencyId: "upstream-primary",
      endpointChecked: "/health",
      attempts: 3,
      lastError: "timeout_exceeded"
    },
    timestamp: new Date().toISOString()
  };
  next(err);
});

routes.use((err, req, res, next) => {
  if (err?.name === "ZodError") {
    return res.status(400).json({
      error: "ValidationError",
      details: err.errors
    });
  }
  if (err?.structured) {
    const status =
      err?.response?.status ?? err?.status;
    return res.status(typeof status === "number" ? status : 502).json({
      ok: false,
      error: err.structured
    });
  }
  const status =
    err?.response?.status ?? err?.status;
  res.status(typeof status === "number" ? status : 502).json({
    error: err.name || "Error",
    message: err.message
  });
});

export default routes;
