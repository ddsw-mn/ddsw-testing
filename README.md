# Courses & Students REST API

Node.js + Express REST API con almacenamiento en memoria. Sin base de datos real.

## Setup

```bash
npm install
npm start          # producción
npm run dev        # auto-restart (Node ≥ 18)
```

El servidor escucha en `process.env.PORT` o **3000** por defecto.

---

## Arquitectura

```
src/
├── controllers/   ← maneja req/res, delega al service
├── services/      ← lógica de negocio (validación, resolución de relaciones)
├── repositories/  ← CRUD puro sobre arrays en memoria
├── routes/        ← declaración de rutas
├── db/
│   ├── store.js   ← arrays compartidos en memoria
│   └── seed.js    ← datos iniciales (corre al arrancar)
└── app.js
index.js           ← entrada del servidor
```

---

## Endpoints

### Students `/api/students`

| Método | Path                | Descripción                                | Status |
|--------|---------------------|--------------------------------------------|--------|
| GET    | `/api/students`     | Listar todos los alumnos                   | 200    |
| GET    | `/api/students/:id` | Obtener alumno por ID                      | 200    |
| POST   | `/api/students`     | Crear alumno                               | 201    |
| PUT    | `/api/students/:id` | Reemplazar alumno (todos los campos)       | 200    |
| PATCH  | `/api/students/:id` | Actualizar campos parcialmente             | 200    |
| DELETE | `/api/students/:id` | Eliminar alumno (cascada en cursos)        | 204    |

### Courses `/api/courses`

| Método | Path                | Descripción                                | Status |
|--------|---------------------|--------------------------------------------|--------|
| GET    | `/api/courses`      | Listar todos los cursos (alumnos resueltos)| 200    |
| GET    | `/api/courses/:id`  | Obtener curso por ID (alumnos resueltos)   | 200    |
| POST   | `/api/courses`      | Crear curso                                | 201    |
| PUT    | `/api/courses/:id`  | Reemplazar curso (todos los campos)        | 200    |
| PATCH  | `/api/courses/:id`  | Actualizar campos parcialmente             | 200    |
| DELETE | `/api/courses/:id`  | Eliminar curso                             | 204    |

---

## Ejemplos de body

### POST /api/students

```json
{
  "firstName": "Ana",
  "lastName": "López",
  "email": "ana.lopez@mail.com",
  "age": 23,
  "enrollmentYear": 2021,
  "major": "Ingeniería en Sistemas"
}
```

### PUT /api/students/:id

Misma estructura que POST — todos los campos son obligatorios.

### PATCH /api/students/:id

```json
{
  "age": 24,
  "major": "Ciencias de la Computación"
}
```

---

### POST /api/courses

```json
{
  "name": "Programación Orientada a Objetos",
  "description": "Paradigma OOP, patrones de diseño y buenas prácticas.",
  "credits": 5,
  "department": "Informática",
  "schedule": "Martes y Jueves 18:00-20:00",
  "studentIds": []
}
```

### PUT /api/courses/:id

Misma estructura que POST — todos los campos son obligatorios (`studentIds` se puede omitir, defaultea a `[]`).

### PATCH /api/courses/:id

```json
{
  "schedule": "Lunes y Viernes 08:00-10:00",
  "studentIds": ["a1b2c3d4-e5f6-7890-abcd-ef1234567890"]
}
```

---

## Respuestas de error

Todos los errores tienen el formato:

```json
{ "error": "Mensaje descriptivo" }
```

| Status | Significado                    |
|--------|--------------------------------|
| 400    | Validación / body incorrecto   |
| 404    | Recurso no encontrado          |
| 500    | Error inesperado del servidor  |

---

## Notas

- Eliminar un alumno remueve automáticamente su ID de todos los cursos (`studentIds`).
- Los GET de cursos siempre incluyen el array `students` con objetos Student completos (no IDs crudos).
- Los nuevos IDs se generan con `crypto.randomUUID()` (built-in de Node.js, sin dependencias extra).

## Postman
En `utn.postman_collection.json` cuentan con una colección de ejemplo para probar y tomar como referencia.

---

## Testing

```bash
npm test
```

Corre las suites de Jest en `__tests__/` (mocking de `axios`/`dotenv`, sin llamadas reales a APIs externas).

## CI/CD (GitHub Actions)

### `.github/workflows/ci-cd.yml` — CI + publicación de imagen

- **`test`**: en cada push (a cualquier rama), instala dependencias (`npm ci`) y corre `npm test`.
- **`build-and-push`**: sólo si `test` pasó en verde y el push fue a `master` (o se dispara manualmente con `workflow_dispatch`), construye la imagen Docker y la publica.

Para que `build-and-push` funcione hay que cargar dos secrets en el repo (**Settings → Secrets and variables → Actions**):

| Secret               | Valor                          |
|----------------------|---------------------------------|
| `DOCKERHUB_USERNAME` | usuario de Docker Hub          |
| `DOCKERHUB_TOKEN`    | access token de Docker Hub     |

### `.github/workflows/pr-checks.yml` — gate de Pull Requests a `master`

Se dispara al abrir, reabrir o actualizar un PR contra `master`:

- **`test`**: corre `npm test` sobre el código del PR.
- **`no-unresolved-comments`**: usa la API GraphQL de GitHub (vía `actions/github-script`) para chequear que no queden *review threads* sin resolver. Si hay comentarios de revisión abiertos, el job falla.

Para que estos checks bloqueen el botón de mergear hay que marcarlos como **required status checks** en una branch protection rule sobre `master` (**Settings → Branches → Add rule**). Alternativa nativa de GitHub (sin necesidad de este job): activar directamente la opción **"Require conversation resolution before merging"** en esa misma regla.

## Docker

```bash
# Construir la imagen
docker build -t courses-students-api:1.0 .

# Levantar el contenedor
docker run -p 3000:3000 courses-students-api:1.0

# Ver contenedores corriendo
docker ps

# Ver logs
docker logs <container_id>

# Entrar a una shell dentro del contenedor
docker exec -it <container_id> sh
```