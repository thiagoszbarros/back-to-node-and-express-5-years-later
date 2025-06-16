import 'dotenv/config';
import mongoLogger from './mongoLogger.js';
import fileLogger from './fileLogger.js';
import { Levels } from './levels.js';
import { Channels } from './channels.js';

const logStack = (process.env.LOG_STACK || 'file')
  .split(',');

const mongodb = mongoLogger();
const file = fileLogger();

function _defineResponseLogLevel(statusCode) {
  if (statusCode >= 500) {
    return Levels.ERROR
  };

  if (statusCode >= 400) {
    return Levels.NOTICE
  };

  return Levels.INFO;
}

export async function logMessage(statusCode = 200, message, meta = {}) {
  const level = _defineResponseLogLevel(statusCode)
  if (logStack.includes(Channels.FILE)) {
    file.log(level, message);
  }
  if (logStack.includes(Channels.MONGODB)) {
    mongodb.log(level, message, meta);
  }
}
