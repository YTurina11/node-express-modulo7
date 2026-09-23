const { Client } = require('pg');
const { User } = require('../models');

// Consulta directa con SQL para comparar con la consulta equivalente en Sequelize.
const getUsersWithRawSQL = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  try {
    await client.connect();
    const result = await client.query(
      'SELECT id, nombre, email, rol, activo, "createdAt", "updatedAt" FROM usuarios ORDER BY id ASC'
    );
    return result.rows;
  } finally {
    await client.end();
  }
};

const compareSQLAndORM = async () => {
  const [sqlRows, ormRows] = await Promise.all([
    getUsersWithRawSQL(),
    User.unscoped().findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt', 'updatedAt'],
      order: [['id', 'ASC']]
    })
  ]);

  const normalizedORM = ormRows.map((user) => user.toJSON());
  const sqlData = JSON.stringify(sqlRows);
  const ormData = JSON.stringify(normalizedORM);

  return {
    sql: sqlRows,
    orm: normalizedORM,
    coinciden: sqlData === ormData,
    cantidadSQL: sqlRows.length,
    cantidadORM: normalizedORM.length
  };
};

module.exports = { compareSQLAndORM };
