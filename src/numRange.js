'use strict';

// DECLARES -----------------------------------------------------------------------------

const log = require('./misc/log');

// FUNCTIONS -----------------------------------------------------------------------------

export function setNumRangeForRow(bong, row) {
  setNumRangeForRowSign1(bong, row);
  setNumRangeForRowSignX(bong, row);
  setNumRangeForRowSign2(bong, row);
  setNumMultiRangeForRow(bong, row);
}

function setNumMultiRangeForRow(bong, row) {
  const rowNum1 = row.num1;
  const rowNumX = row.numX;
  const rowNum2 = row.num2;

  const inRange1 =
    bong.estNum1MultiRange1.includes(rowNum1) && bong.estNumXMultiRange1.includes(rowNumX) && bong.estNum2MultiRange1.includes(rowNum2);

  const costRange1 = inRange1 ? 1 : 0;

  row.costNumMultiRange1 = costRange1;
  row.profitNumMultiRange1 = (inRange1 ? row.win : 0) - costRange1;
}

function setNumRangeForRowSign1(bong, row) {
  const rowNum = row.num1;

  const inRange1 = bong.estNum1Range1.includes(rowNum);
  const inRange2 = bong.estNum1Range2.includes(rowNum);
  const inRange3 = bong.estNum1Range3.includes(rowNum);
  const inRange4 = bong.estNum1Range4.includes(rowNum);

  const costRange1 = inRange1 ? 1 : 0;
  const costRange2 = inRange2 ? 1 : 0;
  const costRange3 = inRange3 ? 1 : 0;
  const costRange4 = inRange4 ? 1 : 0;

  row.costNum1Range1 = costRange1;
  row.costNum1Range2 = costRange2;
  row.costNum1Range3 = costRange3;
  row.costNum1Range4 = costRange4;

  row.profitNum1Range1 = (inRange1 ? row.win : 0) - costRange1;
  row.profitNum1Range2 = (inRange2 ? row.win : 0) - costRange2;
  row.profitNum1Range3 = (inRange3 ? row.win : 0) - costRange3;
  row.profitNum1Range4 = (inRange4 ? row.win : 0) - costRange4;
}

function setNumRangeForRowSignX(bong, row) {
  const rowNum = row.numX;

  const inRange1 = bong.estNumXRange1.includes(rowNum);
  const inRange2 = bong.estNumXRange2.includes(rowNum);
  const inRange3 = bong.estNumXRange3.includes(rowNum);
  const inRange4 = bong.estNumXRange4.includes(rowNum);

  const costRange1 = inRange1 ? 1 : 0;
  const costRange2 = inRange2 ? 1 : 0;
  const costRange3 = inRange3 ? 1 : 0;
  const costRange4 = inRange4 ? 1 : 0;

  row.costNumXRange1 = costRange1;
  row.costNumXRange2 = costRange2;
  row.costNumXRange3 = costRange3;
  row.costNumXRange4 = costRange4;

  row.profitNumXRange1 = (inRange1 ? row.win : 0) - costRange1;
  row.profitNumXRange2 = (inRange2 ? row.win : 0) - costRange2;
  row.profitNumXRange3 = (inRange3 ? row.win : 0) - costRange3;
  row.profitNumXRange4 = (inRange4 ? row.win : 0) - costRange4;
}

function setNumRangeForRowSign2(bong, row) {
  const rowNum = row.num2;

  const inRange1 = bong.estNum2Range1.includes(rowNum);
  const inRange2 = bong.estNum2Range2.includes(rowNum);
  const inRange3 = bong.estNum2Range3.includes(rowNum);
  const inRange4 = bong.estNum2Range4.includes(rowNum);

  const costRange1 = inRange1 ? 1 : 0;
  const costRange2 = inRange2 ? 1 : 0;
  const costRange3 = inRange3 ? 1 : 0;
  const costRange4 = inRange4 ? 1 : 0;

  row.costNum2Range1 = costRange1;
  row.costNum2Range2 = costRange2;
  row.costNum2Range3 = costRange3;
  row.costNum2Range4 = costRange4;

  row.profitNum2Range1 = (inRange1 ? row.win : 0) - costRange1;
  row.profitNum2Range2 = (inRange2 ? row.win : 0) - costRange2;
  row.profitNum2Range3 = (inRange3 ? row.win : 0) - costRange3;
  row.profitNum2Range4 = (inRange4 ? row.win : 0) - costRange4;
}

export function setNumRangeForStat(stats) {
  setNumRangeForStatKey(stats, 'costNum1Range');
  setNumRangeForStatKey(stats, 'profitNum1Range');

  setNumRangeForStatKey(stats, 'costNumXRange');
  setNumRangeForStatKey(stats, 'profitNumXRange');

  setNumRangeForStatKey(stats, 'costNum2Range');
  setNumRangeForStatKey(stats, 'profitNum2Range');

  setNumRangeForStatKey(stats, 'costNumMultiRange', 1);
  setNumRangeForStatKey(stats, 'profitNumMultiRange', 1);
}

function setNumRangeForStatKey(stats, key, qty = 4) {
  for (let i = 1; i <= qty; i++) {
    stats[key + i.toString()] = 0;
  }
}

export function updateNumRangeForStat(row, stats) {
  updateNumRangeForStatKey(row, stats, 'costNum1Range');
  updateNumRangeForStatKey(row, stats, 'costNumXRange');
  updateNumRangeForStatKey(row, stats, 'costNum2Range');
  updateNumRangeForStatKey(row, stats, 'costNumMultiRange', 1);

  updateNumRangeForStatKey(row, stats, 'profitNum1Range');
  updateNumRangeForStatKey(row, stats, 'profitNumXRange');
  updateNumRangeForStatKey(row, stats, 'profitNum2Range');
  updateNumRangeForStatKey(row, stats, 'profitNumMultiRange', 1);
}

function updateNumRangeForStatKey(row, stats, key, qty = 4) {
  let fullKey;
  for (let i = 1; i <= qty; i++) {
    fullKey = key + i.toString();
    stats[fullKey] = stats[fullKey] + row[fullKey];
  }
}
