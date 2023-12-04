import path from 'path';
import { fileURLToPath } from 'url';

import fs from 'fs-extra';
import { parse } from 'node-html-parser';
import { createServer, build } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRJ_ROOT_PATH = path.resolve(__dirname, '..');
const RENDER_FILE_PATH = path.resolve(PRJ_ROOT_PATH, 'scripts/render.jsx');
const INDEX_FILE_PATH = path.resolve(PRJ_ROOT_PATH, 'index.html');
const COPIED_FILE_PATH = path.resolve(PRJ_ROOT_PATH, '.index.html');

const prerender = async () => {
  /**
   *
   */
  const server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  const { render } = await server.ssrLoadModule(RENDER_FILE_PATH);
  const apps = render();
  server.close();

  /**
   *
   */
  const html = parse(fs.readFileSync(INDEX_FILE_PATH, 'utf-8'));
  apps.forEach((app) => {
    const container = html.querySelector('#' + app.id);
    const content = parse(app.content, { comment: true });
    container.appendChild(content);
  });

  /**
   *
   */
  fs.copyFileSync(INDEX_FILE_PATH, COPIED_FILE_PATH);
  fs.writeFileSync(INDEX_FILE_PATH, html.toString(), 'utf-8');
  await build();
  fs.copyFileSync(COPIED_FILE_PATH, INDEX_FILE_PATH);
  fs.removeSync(COPIED_FILE_PATH);
};

prerender();
