import { exec } from 'child_process';
import { promises as fs } from 'fs';

async function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`);
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}

try {
  await executeCommand('vite build');
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 