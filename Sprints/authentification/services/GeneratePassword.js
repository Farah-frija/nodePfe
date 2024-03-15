const generator = require('generate-password');
function generateRandomNumber() {
    return Math.floor(Math.random() * (15 - 8 + 1)) + 8;
  }
  

const generatePassword = () => {
  return generator.generate({
    length: generateRandomNumber(),
    numbers: true,
    symbols: true,
    lowercase: true,
    uppercase: true,
    excludeSimilarCharacters: false,
    strict: true
  });
};

module.exports = generatePassword;