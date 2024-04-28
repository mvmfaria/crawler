const { exec } = require('child_process');

function executeDownloader(comand)
{
    exec(comand, (error, stdout, stderr) => {
        if (error) {
          console.error(`error running python: ${error}`);
          return;
        }
        console.log(`python output: ${stdout}`);
    });
}

module.exports = {executeDownloader}