'use strict';

// DECLARES -----------------------------------------------------------------------------

const log = require('./misc/log');

// FUNCTIONS -----------------------------------------------------------------------------

export function setNumRangeForRow(bong, row) {
  setNumRangeForRowSign1(bong, row);
  setNumRangeForRowSignX(bong, row);
  setNumRangeForRowSign2(bong, row);
  setNumMultiRangeForRowSignX2(bong, row);
}

function setNumMultiRangeForRowSignX2(bong, row) {
  const rowNum1 = row.num1;
  const rowNumX = row.numX;
  const rowNum2 = row.num2;

  const inRange1 = bong.estNumXRange1.includes(rowNumX) && bong.estNum2Range1.includes(rowNum2);
  const inRange2 = bong.estNumXRange2.includes(rowNumX) && bong.estNum2Range2.includes(rowNum2);
  const inRange3 = bong.estNumXRange3.includes(rowNumX) && bong.estNum2Range3.includes(rowNum2);
  const inRange4 = bong.estNumXRange4.includes(rowNumX) && bong.estNum2Range4.includes(rowNum2);
  const inRange5 = bong.estNumXRange5.includes(rowNumX) && bong.estNum2Range5.includes(rowNum2);
  const inRange6 = bong.estNumXRange6.includes(rowNumX) && bong.estNum2Range6.includes(rowNum2);

  const costRange1 = inRange1 ? 1 : 0;
  const costRange2 = inRange2 ? 1 : 0;
  const costRange3 = inRange3 ? 1 : 0;
  const costRange4 = inRange4 ? 1 : 0;
  const costRange5 = inRange5 ? 1 : 0;
  const costRange6 = inRange6 ? 1 : 0;

  row.costNumX2Range1 = costRange1;
  row.costNumX2Range2 = costRange2;
  row.costNumX2Range3 = costRange3;
  row.costNumX2Range4 = costRange4;
  row.costNumX2Range5 = costRange5;
  row.costNumX2Range6 = costRange6;

  row.profitNumX2Range1 = (inRange1 ? row.win : 0) - costRange1;
  row.profitNumX2Range2 = (inRange2 ? row.win : 0) - costRange2;
  row.profitNumX2Range3 = (inRange3 ? row.win : 0) - costRange3;
  row.profitNumX2Range4 = (inRange4 ? row.win : 0) - costRange4;
  row.profitNumX2Range5 = (inRange5 ? row.win : 0) - costRange5;
  row.profitNumX2Range6 = (inRange6 ? row.win : 0) - costRange6;
}

function setNumRangeForRowSign1(bong, row) {
  const rowNum = row.num1;

  const inRange1 = bong.estNum1Range1.includes(rowNum);
  const inRange2 = bong.estNum1Range2.includes(rowNum);
  const inRange3 = bong.estNum1Range3.includes(rowNum);
  const inRange4 = bong.estNum1Range4.includes(rowNum);
  const inRange5 = bong.estNum1Range5.includes(rowNum);
  const inRange6 = bong.estNum1Range6.includes(rowNum);

  const costRange1 = inRange1 ? 1 : 0;
  const costRange2 = inRange2 ? 1 : 0;
  const costRange3 = inRange3 ? 1 : 0;
  const costRange4 = inRange4 ? 1 : 0;
  const costRange5 = inRange5 ? 1 : 0;
  const costRange6 = inRange6 ? 1 : 0;

  row.costNum1Range1 = costRange1;
  row.costNum1Range2 = costRange2;
  row.costNum1Range3 = costRange3;
  row.costNum1Range4 = costRange4;
  row.costNum1Range5 = costRange5;
  row.costNum1Range6 = costRange6;

  row.profitNum1Range1 = (inRange1 ? row.win : 0) - costRange1;
  row.profitNum1Range2 = (inRange2 ? row.win : 0) - costRange2;
  row.profitNum1Range3 = (inRange3 ? row.win : 0) - costRange3;
  row.profitNum1Range4 = (inRange4 ? row.win : 0) - costRange4;
  row.profitNum1Range5 = (inRange5 ? row.win : 0) - costRange5;
  row.profitNum1Range6 = (inRange6 ? row.win : 0) - costRange6;
}

function setNumRangeForRowSignX(bong, row) {
  const rowNum = row.numX;

  const inRange1 = bong.estNumXRange1.includes(rowNum);
  const inRange2 = bong.estNumXRange2.includes(rowNum);
  const inRange3 = bong.estNumXRange3.includes(rowNum);
  const inRange4 = bong.estNumXRange4.includes(rowNum);
  const inRange5 = bong.estNumXRange5.includes(rowNum);
  const inRange6 = bong.estNumXRange6.includes(rowNum);

  const costRange1 = inRange1 ? 1 : 0;
  const costRange2 = inRange2 ? 1 : 0;
  const costRange3 = inRange3 ? 1 : 0;
  const costRange4 = inRange4 ? 1 : 0;
  const costRange5 = inRange5 ? 1 : 0;
  const costRange6 = inRange6 ? 1 : 0;

  row.costNumXRange1 = costRange1;
  row.costNumXRange2 = costRange2;
  row.costNumXRange3 = costRange3;
  row.costNumXRange4 = costRange4;
  row.costNumXRange5 = costRange5;
  row.costNumXRange6 = costRange6;

  row.profitNumXRange1 = (inRange1 ? row.win : 0) - costRange1;
  row.profitNumXRange2 = (inRange2 ? row.win : 0) - costRange2;
  row.profitNumXRange3 = (inRange3 ? row.win : 0) - costRange3;
  row.profitNumXRange4 = (inRange4 ? row.win : 0) - costRange4;
  row.profitNumXRange5 = (inRange5 ? row.win : 0) - costRange5;
  row.profitNumXRange6 = (inRange6 ? row.win : 0) - costRange6;
}

function setNumRangeForRowSign2(bong, row) {
  const rowNum = row.num2;

  const inRange1 = bong.estNum2Range1.includes(rowNum);
  const inRange2 = bong.estNum2Range2.includes(rowNum);
  const inRange3 = bong.estNum2Range3.includes(rowNum);
  const inRange4 = bong.estNum2Range4.includes(rowNum);
  const inRange5 = bong.estNum2Range5.includes(rowNum);
  const inRange6 = bong.estNum2Range6.includes(rowNum);

  const costRange1 = inRange1 ? 1 : 0;
  const costRange2 = inRange2 ? 1 : 0;
  const costRange3 = inRange3 ? 1 : 0;
  const costRange4 = inRange4 ? 1 : 0;
  const costRange5 = inRange5 ? 1 : 0;
  const costRange6 = inRange6 ? 1 : 0;

  row.costNum2Range1 = costRange1;
  row.costNum2Range2 = costRange2;
  row.costNum2Range3 = costRange3;
  row.costNum2Range4 = costRange4;
  row.costNum2Range5 = costRange5;
  row.costNum2Range6 = costRange6;

  row.profitNum2Range1 = (inRange1 ? row.win : 0) - costRange1;
  row.profitNum2Range2 = (inRange2 ? row.win : 0) - costRange2;
  row.profitNum2Range3 = (inRange3 ? row.win : 0) - costRange3;
  row.profitNum2Range4 = (inRange4 ? row.win : 0) - costRange4;
  row.profitNum2Range5 = (inRange5 ? row.win : 0) - costRange5;
  row.profitNum2Range6 = (inRange6 ? row.win : 0) - costRange6;
}

export function setNumRangeForStat(stats) {
  setNumRangeForStatKey(stats, 'costNum1Range', 6);
  setNumRangeForStatKey(stats, 'costNumXRange', 6);
  setNumRangeForStatKey(stats, 'costNum2Range', 6);
  setNumRangeForStatKey(stats, 'costNumX2Range', 6);

  setNumRangeForStatKey(stats, 'profitNum1Range', 6);
  setNumRangeForStatKey(stats, 'profitNumXRange', 6);
  setNumRangeForStatKey(stats, 'profitNum2Range', 6);
  setNumRangeForStatKey(stats, 'profitNumX2Range', 6);
}

function setNumRangeForStatKey(stats, key, qty) {
  for (let i = 1; i <= qty; i++) {
    stats[key + i.toString()] = 0;
  }
}

export function updateNumRangeForStat(row, stats) {
  updateNumRangeForStatKey(row, stats, 'costNum1Range', 6);
  updateNumRangeForStatKey(row, stats, 'costNumXRange', 6);
  updateNumRangeForStatKey(row, stats, 'costNum2Range', 6);
  updateNumRangeForStatKey(row, stats, 'costNumX2Range', 6);

  updateNumRangeForStatKey(row, stats, 'profitNum1Range', 6);
  updateNumRangeForStatKey(row, stats, 'profitNumXRange', 6);
  updateNumRangeForStatKey(row, stats, 'profitNum2Range', 6);
  updateNumRangeForStatKey(row, stats, 'profitNumX2Range', 6);
}

function updateNumRangeForStatKey(row, stats, key, qty) {
  let fullKey;
  for (let i = 1; i <= qty; i++) {
    fullKey = key + i.toString();
    stats[fullKey] = stats[fullKey] + row[fullKey];
  }
}
