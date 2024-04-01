const fs = require('fs');

function readFileWithTheBreeds(filepath)
{
    const data = fs.readFileSync(filepath, 'utf8');
    const json = JSON.parse(data);
    const breeds = json.breeds;
    return breeds;
}

module.exports = {
    readFileWithTheBreeds
}