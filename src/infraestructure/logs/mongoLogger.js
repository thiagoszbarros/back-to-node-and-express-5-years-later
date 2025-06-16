import { Levels } from './levels.js';
import Log from '../schemas/logs.schema.js';
import fileLogger from './fileLogger.js';

const file = fileLogger();

function mongoLogger() {
  async function log(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const safeMessage = typeof message === 'string' ? message : JSON.stringify(message);
    try {
      Log.create({ timestamp, level, message: safeMessage, meta });
    } catch (err) {
      file.log(Levels.EMERGENCY, `Failed to log to MongoDB: ${err.message}`);
      file.log(level, safeMessage);
    }
  }

  return {
    log,
  };
}

export default mongoLogger;
