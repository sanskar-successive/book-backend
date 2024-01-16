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
    "travel", "study", "fitness", "lifestyle", "sports"
  ]);

  const getRandomBool = () => faker.datatype.boolean(0.9);
  const getRandomNumber = (min, max) => faker.number.int({ min, max });

  return {

    title: faker.music.songName(),
    body:{
      description: faker.lorem.paragraph(),
      links:faker.internet.url()
    },
    imageUrl: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${getRandomNumber(1,100)}`,
    categories: getRandomCategory(),
    likes:getRandomNumber(1, 1000),
    approved :getRandomBool(),
    isSensitive: getRandomBool(),
    tags: faker.commerce.productName(),
    writer: {
      id: faker.string.nanoid(10),
      name: faker.person.fullName(),
      email: faker.internet.email() ,
      profilePicUrl: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${getRandomNumber(1,100)}`,
      famousWorks: faker.lorem.words(),
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
const numberOfRecords = 1000;
const csvFilePath = 'blog_data.csv';

const fileStats = fs.statSync('blog_data.csv');
const fileSize = fileStats.size;
console.log(fileStats);


generateAndWriteToCSV(numberOfRecords, csvFilePath);