'use strict';

// DECLARES -----------------------------------------------------------------------------

const { Parser } = require('json2csv');
const csvtojson = require('csvtojson');

// FUNCTIONS -----------------------------------------------------------------------------

export function writeToFileStream({ data = null, columnDelimiter = ';', lineDelimiter = '\n', stream, writeHeaders = false }) {
  // @source: https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/

  const fs = require('fs');
  let result, ctr, keys;

  if (data === null || !data.length) {
    console.log('Data is empty, nothing to write to file stream!');
    return;
  }

  console.log('Write to file stream, data length:', data.length);

  result = '';
  keys = Object.keys(data[0]);
  if (writeHeaders) {
    result += keys.join(columnDelimiter);
    result += lineDelimiter;
    stream.write(result);
  }

  let line = 0;
  data.forEach((item) => {
    result = '';
    line++;
    if (line % 500000 === 0) {
      console.log('Line: ', line);
    }
    ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) {
        result += columnDelimiter;
      }
      const val = toRegionalString(item[key]);
      result += typeof item[key] === 'string' && item[key].includes(columnDelimiter) ? `"${item[key]}"` : toRegionalString(item[key]);
      ctr++;
    });
    result += lineDelimiter;
    stream.write(result);
  });
}

export function createFileStream(filename) {
  const fs = require('fs');
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
  return fs.createWriteStream(filename, { flags: 'a' });
}

export function closeFileStream(stream) {
  stream.end();
}

exports.csvFileToJson = async (filepath, delimiter) => csvtojson({ delimiter }).fromFile(filepath);

/*
export async function csvFileToJson(filepath, delimiter) {
  csvtojson({ delimiter }).fromFile(filepath);
}
*/

export function syncWriteToCsvFile(data, filepath, delimiter) {
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
}

export function asyncWriteToCsvFile(data, filepath, delimiter) {
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
}

export function asyncWriteToCsvFile2(data, filepath, delimiter) {
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
}

// INTERNAL FUNCTIONS -----------------------------------------------------------------------------

function toRegionalString(data) {
  if (typeof data !== 'number') {
    return data;
  }
  const str = data.toString().replace(/\./g, ',');
  return str;
}
