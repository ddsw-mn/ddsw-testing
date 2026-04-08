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
