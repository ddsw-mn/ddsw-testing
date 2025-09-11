# Testing Class - API Demo

Este proyecto es una API demo para enseñar conceptos de testing con Jest y mocking de axios. La aplicación consume datos de JSONPlaceholder y combina información de usuarios con sus tareas (todos).

## 📋 Estructura del Proyecto

```
testing-class/
├── babel.config.json          # Configuración de Babel para ES6
├── package.json               # Dependencias y scripts
├── server.js                  # Servidor Express principal
├── .env                       # Variables de entorno (desarrollo)
├── .env.development           # Variables específicas de desarrollo
├── .env.production            # Variables específicas de producción
├── __tests__/                 # Carpeta de tests
│   └── todos.client.test.js   # Tests para TodosClient
├── clients/                   # Clientes HTTP
│   ├── todos.client.js        # Cliente para API de todos
│   └── user.client.js         # Cliente para API de usuarios
├── controllers/               # Controladores de rutas
│   └── controller.js          # Controlador principal
├── routes/                    # Definición de rutas
│   └── routes.js              # Rutas de la API
└── services/                  # Lógica de negocio
    └── todos-assignment.service.js  # Servicio para combinar usuarios y todos
```

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js (v16 o superior)
- npm

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd testing-class

# Instalar dependencias
npm install

# Instalar dependencias de desarrollo (para testing)
npm install --save-dev jest @babel/core @babel/preset-env babel-jest
```

### Variables de Entorno
El proyecto utiliza diferentes archivos de configuración según el entorno:

- `.env` - Variables por defecto
- `.env.development` - Variables para desarrollo
- `.env.production` - Variables para producción

Variables configuradas:
```env
NODE_ENV=development
API_BASE_URL=https://jsonplaceholder.typicode.com
PORT=3000
```

## 🏃‍♂️ Ejecutar la Aplicación

### Modo Desarrollo
```bash
npm run start:development
```

### Modo Producción
```bash
npm run start:prod
```

La aplicación estará disponible en: `http://localhost:3000`

### Endpoints Disponibles
- `GET /assignments` - Obtiene usuarios con sus tareas asignadas

## 🧪 Testing

### Configuración de Testing

El proyecto utiliza **Jest** como framework de testing con las siguientes configuraciones:

#### babel.config.json
```json
{
  "presets": ["@babel/preset-env"]
}
```

Esta configuración permite que Jest procese módulos ES6 (`import/export`).

#### package.json - Scripts de Testing
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos)
npm run test:watch

# Ejecutar tests con coverage
npm test -- --coverage
```

## 📝 Tests del TodosClient

### Estructura del Test (`__tests__/todos.client.test.js`)

El archivo de test está organizado en las siguientes secciones:

#### 1. **Setup y Mocking**
```javascript
import { TodosClient } from '../clients/todos.client.js';
import axios from 'axios';

// Mock axios completo
jest.mock('axios');
const mockedAxios = axios;

// Mock dotenv para evitar dependencias de archivos
jest.mock('dotenv', () => ({
  config: jest.fn()
}));
```

#### 2. **Configuración de Tests (beforeEach)**
```javascript
beforeEach(() => {
  jest.clearAllMocks();
  
  mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  };
  
  mockedAxios.create.mockReturnValue(mockAxiosInstance);
  todosClient = new TodosClient();
});
```

#### 3. **Tests del Constructor**
- Verifica que `axios.create` se llame con la configuración por defecto
- Verifica que acepte configuración personalizada
- Valida headers y timeout

#### 4. **Tests de Métodos HTTP**

**getTodos():**
- ✅ Retorna datos y status en caso de éxito
- ✅ Maneja errores correctamente
- ✅ Llama al endpoint correcto (`/todos`)

**getTodosById(id):**
- ✅ Retorna todo específico por ID
- ✅ Llama al endpoint correcto (`/todos/{id}`)

**createTodos(payload):**
- ✅ Crea nuevo todo
- ✅ Envía payload correctamente
- ✅ Retorna datos creados

**updateTodos(id, payload):**
- ✅ Actualiza todo existente
- ✅ Envía ID y payload correctos

**deleteTodos(id):**
- ✅ Elimina todo por ID
- ✅ Maneja respuesta de eliminación

### Conceptos de Testing Aplicados

#### 1. **Mocking de Dependencias Externas**
```javascript
// Mock completo del módulo axios
jest.mock('axios');

// Mock de instancia específica
mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  // ...
};
```

#### 2. **Assertions (Verificaciones)**
```javascript
// Verificar que se llamó con parámetros correctos
expect(mockAxiosInstance.get).toHaveBeenCalledWith('/todos');

// Verificar formato de respuesta
expect(result).toEqual({
  data: mockResponse.data,
  status: 200
});
```

#### 3. **Manejo de Promesas**
```javascript
// Test de caso exitoso
mockAxiosInstance.get.mockResolvedValue(mockResponse);
const result = await todosClient.getTodos();

// Test de caso de error
mockAxiosInstance.get.mockRejectedValue(mockError);
await expect(todosClient.getTodos()).rejects.toThrow('Network error');
```

#### 4. **Limpieza de Mocks**
```javascript
beforeEach(() => {
  jest.clearAllMocks(); // Limpia historial de llamadas
});
```

## 🔧 Ventajas del Approach de Testing

### 1. **Aislamiento**
- Los tests no dependen de APIs externas
- Son rápidos y confiables
- No requieren conexión a internet

### 2. **Control Total**
- Podemos simular cualquier respuesta (éxito/error)
- Controlamos tiempos de respuesta
- Simulamos edge cases fácilmente

### 3. **Verificación Completa**
- Validamos parámetros enviados
- Verificamos manejo de respuestas
- Confirmamos manejo de errores

### 4. **Mantenibilidad**
- Tests claros y legibles
- Fácil agregar nuevos casos
- Documentación viva del comportamiento

## 📚 Recursos Adicionales

### Jest Documentation
- [Jest Official Docs](https://jestjs.io/docs/getting-started)
- [Mock Functions](https://jestjs.io/docs/mock-functions)
- [Testing Asynchronous Code](https://jestjs.io/docs/asynchronous)

### Best Practices
- Usar descriptivos nombres para tests
- Un test debe verificar una sola cosa
- Tests deben ser independientes entre sí
- Siempre limpiar mocks entre tests

## 🐛 Troubleshooting

### Error: "Cannot use import statement outside a module"
**Solución:** Verificar que `babel.config.json` esté configurado y que las dependencias de Babel estén instaladas.

### Error: "Invalid URL" en tests
**Solución:** Verificar que axios esté correctamente mockeado y que no se estén haciendo llamadas reales.

### Tests no se ejecutan
**Solución:** Verificar que Jest esté instalado como devDependency y que los scripts estén configurados en package.json.

---

**¡Happy Testing! 🎉**
