const { students, courses } = require('./store');

// Fixed UUIDs so cross-entity references are always consistent
const STUDENT_IDS = {
  s1: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  s2: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  s3: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
  s4: 'd4e5f6a7-b8c9-0123-defa-234567890123',
};

const COURSE_IDS = {
  c1: 'e5f6a7b8-c9d0-1234-efab-345678901234',
  c2: 'f6a7b8c9-d0e1-2345-fabc-456789012345',
  c3: 'a7b8c9d0-e1f2-3456-abcd-567890123456',
};

students.push(
  {
    id: STUDENT_IDS.s1,
    firstName: 'Lucía',
    lastName: 'Fernández',
    email: 'lucia.fernandez@mail.com',
    age: 22,
    enrollmentYear: 2022,
    major: 'Ingeniería en Sistemas',
  },
  {
    id: STUDENT_IDS.s2,
    firstName: 'Matías',
    lastName: 'González',
    email: 'matias.gonzalez@mail.com',
    age: 24,
    enrollmentYear: 2020,
    major: 'Licenciatura en Informática',
  },
  {
    id: STUDENT_IDS.s3,
    firstName: 'Valentina',
    lastName: 'Ríos',
    email: 'valentina.rios@mail.com',
    age: 21,
    enrollmentYear: 2023,
    major: 'Ingeniería en Sistemas',
  },
  {
    id: STUDENT_IDS.s4,
    firstName: 'Tomás',
    lastName: 'Herrera',
    email: 'tomas.herrera@mail.com',
    age: 25,
    enrollmentYear: 2019,
    major: 'Ciencias de la Computación',
  }
);

// Course 1: 3 students (s1, s2, s3)
// Course 2: 2 students, one shared with course 1 (s3, s4)
// Course 3: 1 student, shared with course 2 (s4)
courses.push(
  {
    id: COURSE_IDS.c1,
    name: 'Algoritmos y Estructuras de Datos',
    description: 'Fundamentos de algoritmos, complejidad y estructuras de datos clásicas.',
    credits: 6,
    department: 'Informática',
    schedule: 'Lunes y Miércoles 10:00-12:00',
    year: 2024,
    studentIds: [STUDENT_IDS.s1, STUDENT_IDS.s2, STUDENT_IDS.s3],
  },
  {
    id: COURSE_IDS.c2,
    name: 'Bases de Datos',
    description: 'Diseño relacional, SQL, normalización y optimización de consultas.',
    credits: 4,
    department: 'Informática',
    schedule: 'Martes y Jueves 14:00-16:00',
    year: 2024,
    studentIds: [STUDENT_IDS.s3, STUDENT_IDS.s4],
  },
  {
    id: COURSE_IDS.c3,
    name: 'Redes y Comunicaciones',
    description: 'Modelos OSI/TCP-IP, protocolos, routing y seguridad en redes.',
    credits: 4,
    department: 'Telecomunicaciones',
    schedule: 'Viernes 09:00-13:00',
    year: 2025,
    studentIds: [STUDENT_IDS.s4],
  }
);
