# Node & Express Web App – Parte 2, Módulo 7

## Parte 2 – Módulo 7: Acceso a datos en aplicaciones Node

Proyecto backend desarrollado con Node.js 18+, Express, PostgreSQL y Sequelize ORM. Esta versión implementa los requerimientos de la Parte 2 de la evaluación: conexión segura a BD, CRUD, consultas filtradas, validaciones, transacciones con rollback, persistencia de logs, comparación SQL manual vs ORM y relación 1:N entre usuarios y pedidos.

## Requisitos
- Node.js 18 o superior
- PostgreSQL
- npm

## Instalación
```bash
npm install
```

Crear `.env` a partir de `.env.example`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=node_express_app
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_DIALECT=postgres
NODE_ENV=development
```

Crear la base de datos:
```sql
CREATE DATABASE node_express_app;
```

Cargar datos de prueba:
```bash
npm run seed
```

Iniciar:
```bash
npm start
```

Desarrollo con nodemon:
```bash
npm run dev
```

## Endpoints principales

### Usuarios
- `GET /api/usuarios` – lista usuarios, con `?nombre=Juan&page=1&limit=5`.
- `POST /api/usuarios` – crea usuario.
- `PUT /api/usuarios/:id` – actualiza campos permitidos.
- `DELETE /api/usuarios/:id` – elimina usuario validando existencia.
- `GET /api/usuarios/:id/pedidos` – usuario con pedidos mediante Sequelize `include`.
- `POST /api/usuarios/transaccion-registro` – crea usuario + auditoría en una transacción.
- `GET /api/usuarios/comparacion-sql-orm` – ejecuta SQL manual y Sequelize y compara resultados.

### Pedidos
- `GET /api/pedidos`
- `POST /api/pedidos`
- `PUT /api/pedidos/:id`
- `DELETE /api/pedidos/:id`

## Prueba de rollback
Enviar a `POST /api/usuarios/transaccion-registro`:
```json
{
  "nombre": "Prueba Rollback",
  "email": "rollback@empresa.com",
  "password": "password123",
  "rol": "usuario",
  "forceError": true
}
```

La operación falla intencionalmente, se ejecuta rollback y el error queda registrado en `logs/transaction_failures.log`.

## Comparación SQL vs ORM
La ruta `/api/usuarios/comparacion-sql-orm` consulta la misma información de dos maneras:
1. SQL manual utilizando el cliente `pg`.
2. Sequelize utilizando el modelo `User`.

La respuesta indica si los resultados coinciden (`coinciden: true`) y muestra ambos resultados. Esto permite demostrar directamente el requisito de la Lección 5.

## Relaciones
Se implementa una relación 1:N:
- Un `User` tiene muchos `Order`.
- Un `Order` pertenece a un `User`.

Sequelize utiliza `include` para devolver un usuario junto con sus pedidos en una sola consulta lógica.

## Seguridad y buenas prácticas
- Credenciales mediante `.env` y `dotenv`.
- `.env` está excluido por `.gitignore`; se entrega `.env.example` como plantilla.
- Las contraseñas no se devuelven en consultas normales gracias al `defaultScope` del modelo `User`.
- Se validan IDs, existencia de registros, email, campos obligatorios y restricciones del modelo.
- Las respuestas mantienen formato `{ status, message, data }` cuando corresponde.

## Estructura
```text
src/
├── app.js
├── config/database.js
├── controllers/
│   ├── userController.js
│   └── orderController.js
├── models/
│   ├── User.js
│   ├── Order.js
│   ├── AuditLog.js
│   └── index.js
├── routes/
│   ├── userRoutes.js
│   └── orderRoutes.js
├── services/
│   ├── fileLogger.js
│   └── sqlComparison.js
└── seeders/seed.js
logs/
└── .gitkeep
```

## Documentación
Revisar `DOCUMENTACION_JUSTIFICACION_TECNICA.md` para las respuestas y justificaciones de las seis lecciones del Módulo 7.
