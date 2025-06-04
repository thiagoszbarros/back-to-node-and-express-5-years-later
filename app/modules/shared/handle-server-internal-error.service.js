export function handleServerInternalError(res, error) {
  res.status(500).send(error?.message || 'Internal Server Error');
}
