import fs from 'fs';
import path from 'path';
const logFilePath = path.resolve('src/infraestructure/logs/app.log');

function fileLogger() {
  async function log(level, message) {
    const timestamp = new Date().toISOString();
    const output = (typeof message === 'object' && message !== null)
      ? JSON.stringify(message)
      : message;
    fs.appendFileSync(logFilePath, `[${timestamp}] [${level}] ${output}\n`);
  }

  return {
    log,
  };
}

export default fileLogger;
