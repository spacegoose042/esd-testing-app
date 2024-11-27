import { exec } from 'child_process';

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

executeCommand('vite build'); 