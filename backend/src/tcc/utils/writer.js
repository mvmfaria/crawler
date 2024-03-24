const fs = require('fs');

function writeJsonFile(filename, json)
{
    fs.writeFile(filename, json, (err) => {
        if (err) {
            console.error('error writing to json file', err);
            return;
        }
        console.log('json file saved successfully!');
    });
}

module.exports = { 
    writeJsonFile 
}