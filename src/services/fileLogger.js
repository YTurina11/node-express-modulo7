const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../../logs/transaction_failures.log');

// Asegurar que el directorio logs existe
const logDir = path.dirname(logFilePath);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFailedTransaction = (action, error) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] FALLO EN TRANSACCIÓN | Acción: ${action} | Error: ${error.message}\nStack: ${error.stack}\n----------------------------------------\n`;
  
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error('Error al escribir en el archivo de logs:', err);
  });
};

module.exports = { logFailedTransaction };
