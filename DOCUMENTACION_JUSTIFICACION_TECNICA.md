# Justificación técnica – Parte 2, Módulo 7

## 1. Conexión a una base de datos
Se utiliza PostgreSQL con Sequelize como ORM y `pg` como cliente de PostgreSQL para la comparación SQL manual. Sequelize facilita el trabajo con modelos, validaciones y relaciones, mientras que `pg` permite demostrar una consulta SQL tradicional.

Las credenciales se guardan en variables de entorno mediante `dotenv`. El archivo `.env` no se entrega ni se versiona; se incluye `.env.example` como plantilla.

## 2. Obtención de información
`GET /api/usuarios` devuelve usuarios almacenados en PostgreSQL. Incluye filtrado por nombre y paginación mediante query params. Las contraseñas se excluyen de las respuestas mediante el `defaultScope` del modelo `User`.

## 3. Modificación de datos
Se implementan `PUT /api/usuarios/:id` y `DELETE /api/usuarios/:id`. Antes de modificar o eliminar se comprueba que el ID exista. En la actualización sólo se permiten campos controlados (`nombre`, `email`, `rol`, `activo`), evitando modificar el identificador y la contraseña desde ese endpoint.

También se implementa CRUD completo para `Order`, cumpliendo el requisito general de trabajar con al menos dos entidades.

## 4. Transaccionalidad
`POST /api/usuarios/transaccion-registro` realiza dos acciones dentro de una transacción Sequelize:
1. Crear usuario.
2. Crear registro de auditoría.

Si se produce un error, incluyendo `forceError: true`, la transacción se revierte mediante rollback. Además, el error se registra en `logs/transaction_failures.log`, demostrando persistencia mediante archivo plano.

## 5. Acceso con ORM
La ruta `GET /api/usuarios/comparacion-sql-orm` ejecuta la misma consulta mediante:
- SQL manual con `pg`.
- Sequelize ORM con el modelo `User`.

La respuesta incluye ambos resultados y el campo `coinciden`. Esto permite demostrar con una prueba funcional la comparación solicitada.

La principal ventaja encontrada con Sequelize es que permite trabajar con objetos y relaciones mediante JavaScript, reduciendo la cantidad de SQL manual necesario y facilitando la reutilización de modelos, validaciones y asociaciones.

## 6. Manejo de relaciones
Se implementa una relación 1:N:
- `User.hasMany(Order)`.
- `Order.belongsTo(User)`.

La ruta `GET /api/usuarios/:id/pedidos` usa `include` para obtener al usuario junto con sus pedidos asociados. Además, `GET /api/pedidos` muestra los pedidos con información básica del usuario relacionado.

## Checklist de la Parte 2
- [x] PostgreSQL conectado.
- [x] Variables de entorno.
- [x] Log de conexión exitosa.
- [x] GET usuarios.
- [x] Al menos 3 registros mediante seed.
- [x] Filtrado y paginación.
- [x] POST, PUT y DELETE.
- [x] Validaciones y manejo de errores.
- [x] Transacción con dos acciones.
- [x] Rollback demostrable.
- [x] Log de fallos en archivo plano.
- [x] Sequelize ORM.
- [x] Comparación SQL manual vs ORM.
- [x] Relación 1:N.
- [x] Uso de `include`.
- [x] CRUD de dos entidades: usuarios y pedidos.
- [x] README con instalación y uso.
