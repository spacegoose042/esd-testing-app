import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

async function buildApp() {
  try {
    // First modify the source index.html
    const sourceTemplate = await fs.readFile(
      path.resolve('index.html'),
      'utf-8'
    );

    const modifiedSource = sourceTemplate.replace(
      /<script>\s*window\.__APP_CONFIG__[^<]+<\/script>/,
      `<script>
        window.__APP_CONFIG__ = {
          apiUrl: 'https://esd-testing-app-production.up.railway.app',
          isProduction: true
        };
      </script>`
    );

    // Write modified source temporarily
    await fs.writeFile(
      path.resolve('index.html.tmp'),
      modifiedSource
    );

    // Rename files
    await fs.rename(path.resolve('index.html'), path.resolve('index.html.bak'));
    await fs.rename(path.resolve('index.html.tmp'), path.resolve('index.html'));

    // Run Vite build
    await executeCommand('vite build');

    // Restore original index.html
    await fs.rename(path.resolve('index.html.bak'), path.resolve('index.html'));

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