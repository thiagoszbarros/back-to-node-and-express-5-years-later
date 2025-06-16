import { logMessage } from '../logs/logger.js';

function _clone(body) {
  return body ? JSON.parse(JSON.stringify(body)) : body;
}

export function requestResponseLogger(req, res, next) {
  const { method, url, body } = req;
  const requestBodyForLog = _maskSensitiveData(_clone(body)) ?? null;

  logMessage(req.statusCode, `REQUEST: ${method} ${url} BODY: ${JSON.stringify(requestBodyForLog)}`, { type: 'request', method, url, body: requestBodyForLog });

  const original = res.send;
  res.send = function (data) {
    logMessage(res.statusCode, `RESPONSE: ${method} ${url} BODY: ${data}`, { type: 'response', method, url, body: requestBodyForLog, response: data });
    res.send = original;
    return res.send(data);
  };

  next();
}

function _maskSensitiveData(data) {
  if (data && typeof data === 'object') {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (key.toLowerCase() === 'password') {
          data[key] = '**********';
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          _maskSensitiveData(data[key]);
        }
      }
    }
  }
  
  return data;
}