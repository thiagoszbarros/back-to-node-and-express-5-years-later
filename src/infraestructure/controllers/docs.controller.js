import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

function docsController() {
  async function index(_req, res) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const htmlPath = resolve(__dirname, '../views/docs.html');
    const html = await readFile(htmlPath, 'utf8');
    res.type('text/html').send(html);
  };

  return {
    index
  }
}

export default docsController;
