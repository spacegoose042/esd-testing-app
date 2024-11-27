import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

async function buildApp() {
  try {
    // 1. Run Vite build
    await executeCommand('vite build');

    // 2. Read the template
    const template = await fs.readFile(
      path.resolve('index.html'),
      'utf-8'
    );

    // 3. Modify the config script
    const modifiedTemplate = template.replace(
      /<script>\s*window\.__APP_CONFIG__[^<]+<\/script>/,
      `<script>
        window.__APP_CONFIG__ = {
          apiUrl: window.location.origin,
          isProduction: true
        };
      </script>`
    );

    // 4. Write to server/public/index.html
    await fs.writeFile(
      path.resolve('../server/public/index.html'),
      modifiedTemplate
    );

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(stdout);
        console.error(stderr);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

buildApp(); 