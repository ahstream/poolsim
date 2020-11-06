'use strict';

// DECLARES -----------------------------------------------------------------------------

/* eslint-disable no-extend-native */
/* eslint-disable func-names */
/* eslint-disable import/prefer-default-export */

const fs = require('fs');
const jsonfile = require('jsonfile');

// FUNCTIONS -----------------------------------------------------------------------------

export function minOrNone(min, val) {
  return val < min ? 0 : val;
}

export function isWithinBaseRange(baseValue, value, withinPercent) {
  const minValue = baseValue * (1 - withinPercent);
  const maxValue = baseValue * (1 + withinPercent);
  const result = value >= minValue && value <= maxValue ? 1 : 0;
  // console.log('value, baseValue, minValue, maxValue, result', value, baseValue, minValue, maxValue, result);
  return result;
}

export function isWithinBaseRangeMinMax(baseValue, value, minValue, maxValue) {
  return value >= minValue && value <= maxValue ? 1 : 0;
}

export function isValueWithinRangeByDiff(value, baseValue, diff) {
  return baseValue >= value - diff && baseValue <= value + diff ? 1 : 0;
}

export function writeToDebugFile(data, filepath = 'debug.txt') {
  writeToDataFile(data, filepath);
}

export function writeToJsonFile(data, filepath) {
  jsonfile.writeFile(filepath, data, { spaces: 2, EOL: '\r\n' }, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

export function sleep(ms) {
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function writeToDataFile(data, filepath) {
  try {
    fs.writeFileSync(filepath, data, 'utf8');
  } catch (error) {
    console.error(error, filepath);
  }
}
