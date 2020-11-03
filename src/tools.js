/* eslint-disable no-extend-native */
/* eslint-disable func-names */
/* eslint-disable import/prefer-default-export */

const fs = require('fs');
const jsonfile = require('jsonfile');
const { Parser } = require('json2csv');
const csvtojson = require('csvtojson');

exports.csvFileToJson = async (filepath, delimiter) => csvtojson({ delimiter }).fromFile(filepath);

const writeToDataFile = (data, filepath) => {
  try {
    fs.writeFileSync(filepath, data, 'utf8');
  } catch (error) {
    console.error(error, filepath);
  }
};
exports.writeToDataFile = writeToDataFile;

exports.writeToDebugFile = (data, filepath = 'debug.txt') => {
  writeToDataFile(data, filepath);
};

exports.syncWriteToCsvFile = (data, filepath, delimiter) => {
  try {
    const opts = { flatten: true, quote: '"', delimiter };
    const parser = new Parser(opts);
    const dataList = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in data) {
      if (Object.prototype.hasOwnProperty.call(data, prop)) {
        dataList.push(data[prop]);
      }
    }
    const csv = parser.parse(dataList);
    fs.writeFileSync(filepath, csv, 'utf8');
  } catch (error) {
    console.error(error);
  }
};

exports.asyncWriteToCsvFile = (data, filepath, delimiter) => {
  try {
    const { AsyncParser } = require('json2csv');
    const opts = { flatten: true, quote: '"', delimiter };
    const asyncParser = new AsyncParser(opts);

    fs.unlink(filepath, () => {});
    asyncParser.processor
      .on('data', (chunk) => {
        // console.log(chunk);
        fs.appendFile(filepath, chunk.toString(), () => {});
      })
      .on('end', () => console.log('Finished!'))
      .on('error', (err) => console.error(err));

    const jsonData = JSON.stringify(data);
    const data2 = { test1: 1, test2: 2 };
    asyncParser.input.push(jsonData); // This data might come from an HTTP request, etc.
    asyncParser.input.push(null); // Sending `null` to a stream signal that no more data is expected and ends it.
  } catch (error) {
    console.error(error);
  }
};

exports.asyncWriteToCsvFile2 = (data, filepath, delimiter) => {
  try {
    const { parseAsync } = require('json2csv');
    const opts = { flatten: true, quote: '"', delimiter };

    fs.unlink(filepath, () => {});

    parseAsync(data, opts)
      .then((csv) => {
        console.log('csv');
        fs.appendFile(filepath, csv, () => {});
      })
      .catch((err) => console.error(err));
  } catch (error) {
    console.error(error);
  }
};

exports.writeToJsonFile = (data, filepath) => {
  jsonfile.writeFile(filepath, data, { spaces: 2, EOL: '\r\n' }, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

exports.sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
