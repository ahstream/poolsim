// @source: https://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/

export function writeToFileStream({ data = null, columnDelimiter = ';', lineDelimiter = '\n', stream, writeHeaders = false }) {
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

function toRegionalString(data) {
  if (typeof data !== 'number') {
    return data;
  }
  const str = data.toString().replace(/\./g, ',');
  return str;
}
