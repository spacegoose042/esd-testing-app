import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

async function buildApp() {
  try {
    // Run Vite build
    await executeCommand('vite build');

    // Read the generated dist/index.html
    const distTemplate = await fs.readFile(
      path.resolve('../server/public/index.html'),
      'utf-8'
    );

    // Modify the config script
    const modifiedTemplate = distTemplate.replace(
      /<head>/,
      `<head>
        <script>
          window.__APP_CONFIG__ = {
            apiUrl: window.location.origin,
            isProduction: true
          };
        </script>`
    );

    // Write back to server/public/index.html
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