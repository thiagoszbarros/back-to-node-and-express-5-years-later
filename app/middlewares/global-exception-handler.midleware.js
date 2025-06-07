export function globalExceptionHandler(_err, _req, res, _next) {
  res.status(500).send('Internal Server Erroraa');
}
