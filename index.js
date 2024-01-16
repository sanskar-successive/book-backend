const { faker } = require('@faker-js/faker');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const papaparse = require("papaparse");
const fs = require('fs')

const flattenObject = (obj, parentKey = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    return acc;
  }, {});
};


const generateRandomBookData = () => {
  const getRandomLanguage = () => faker.helpers.arrayElement(["english", "hindi", "sanskrit", "telugu", "tamil", "bengali", "german"]);

  const getRandomCategory = () => faker.helpers.arrayElement([
    "fiction", "mystery", "arts", "science", "romance",
    "horror", "religion", "philosophy", "history", "poetry", "biography", "technology"
  ]);

  const getRandomBool = () => faker.datatype.boolean(0.9);
  const getRandomNumber = (min, max) => faker.number.int({ min, max });

  return {
    title: `${faker.music.songName()} ${faker.commerce.productName()}`,
    coverImage: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${getRandomNumber(1,100)}`,
    category: getRandomCategory(),
    author: {
      name: faker.person.fullName(),
      about: faker.lorem.paragraph(),
    },
    rating: getRandomNumber(0, 5),
    price: getRandomNumber(50, 2000),
    moreDetails: {
      publisher: faker.company.name(),
      firstPublished: faker.date.past().toISOString(),
      seller: faker.company.name(),
      language: getRandomLanguage(),
      description: faker.lorem.paragraph(),
      fileSize: getRandomNumber(200, 10000),
      pages: getRandomNumber(50, 600),
      verified: getRandomBool(),
      edition: getRandomNumber(1, 10),
    },
  };
};

const generateAndWriteToCSV = (count, filePath) => {
  const data = [];

  for (let i = 0; i < count; i++) {
    const randomBookData = generateRandomBookData();
    const flattenedData = flattenObject(randomBookData);
    data.push(flattenedData);
  }

  const csvData = papaparse.unparse(data, { header: true });

  fs.writeFileSync(filePath, csvData);

  console.log(`CSV file with ${count} records has been written to ${filePath}`);
};

// Example usage
const numberOfRecords = 1000000;
const csvFilePath = 'books_data4.csv';

const fileStats = fs.statSync('books_data4.csv');
const fileSize = fileStats.size;
console.log(fileStats);


generateAndWriteToCSV(numberOfRecords, csvFilePath);
