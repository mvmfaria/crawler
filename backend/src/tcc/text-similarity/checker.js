const { readFileWithTheBreeds } = require('../utils/reader');
const franc = require('franc');

let breeds = readFileWithTheBreeds("./tcc/text-similarity/breeds.json");

/**
 * Checks if the given text is similar to any of the breeds.
 * @param {string} text - The text to check for similarity.
 * @returns {string|null} - The breed if a match is found, otherwise null.
 */
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

/**
 * Checks if the language of the given text content matches the specified language.
 *
 * @param {string} textContent - The text content to check the language for.
 * @param {string} language - The language to compare the text content against.
 * @returns {boolean} - Returns true if the text content language matches the specified language, otherwise returns false.
 */
function checkTextLanguage(textContent, language)
{
  const textLanguage = franc(textContent);
  if (textLanguage === language) {
    return true;
  } else {
    return false;
  }
}

module.exports = {
  checkIfAreSimilar,
  checkTextLanguage
};