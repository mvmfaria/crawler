const { readFileWithTheBreeds } = require('../utils/reader');

let breeds = readFileWithTheBreeds("./tcc/text-similarity/breeds.json")

function checkIfAreSimilar(text)
{
  for (const breed of breeds) {
    const regex = new RegExp(breed, "i");
    if (regex.test(text)) {
        return breed;
    }
  }
  return null;
}

module.exports = {
  checkIfAreSimilar
};