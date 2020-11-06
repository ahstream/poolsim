'use strict';

// DECLARES -----------------------------------------------------------------------------

const log = require('./misc/log');
const util = require('./misc/util');
const numRange = require('./numRange');
const probRange = require('./probRange');
const bongLib = require('./bong');

// CONSTANTS -----------------------------------------------------------------------------

const MIN_PAYOUT = 15;

// EXPORTED FUNCTIONS -----------------------------------------------------------------------------

export function createRows(bong, bongStats, useNumRange) {
  const bongRows = new Array();
  let rowNumber = 1;

  for (let m1 = 1; m1 <= 3; m1++) {
    for (let m2 = 1; m2 <= 3; m2++) {
      for (let m3 = 1; m3 <= 3; m3++) {
        for (let m4 = 1; m4 <= 3; m4++) {
          for (let m5 = 1; m5 <= 3; m5++) {
            for (let m6 = 1; m6 <= 3; m6++) {
              for (let m7 = 1; m7 <= 3; m7++) {
                for (let m8 = 1; m8 <= 3; m8++) {
                  for (let m9 = 1; m9 <= 3; m9++) {
                    for (let m10 = 1; m10 <= 3; m10++) {
                      for (let m11 = 1; m11 <= 3; m11++) {
                        for (let m12 = 1; m12 <= 3; m12++) {
                          for (let m13 = 1; m13 <= 3; m13++) {
                            const rowInput = {
                              rowNumber,
                              m1,
                              m2,
                              m3,
                              m4,
                              m5,
                              m6,
                              m7,
                              m8,
                              m9,
                              m10,
                              m11,
                              m12,
                              m13,
                            };
                            const row = createRow(bong, rowInput, useNumRange);
                            // bongRows.push(row);
                            bongLib.addRowStats(row, bong, bongStats, useNumRange);
                            rowNumber++;
                            /*
                            if (rowNumber % 100000 === 0) {
                              console.log('rowNumber: ', rowNumber);
                            } */
                            /* if (rowNumber > 100) {
                              return;
                            } */
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return bongRows;
}

// HELPER FUNCTIONS -----------------------------------------------------------------------------

function createRow(bong, rowInput, useNumRange = false) {
  const row = {};
  const rowOutcome = createRowOutcome(rowInput);

  row.bongId = bong.id;
  row.rowNumber = rowInput.rowNumber;

  row.numRight = calcNumRight(rowOutcome, bong.outcome);

  row.num1 = countSign(1, rowInput); // '1' is defined by number 1
  row.numX = countSign(2, rowInput); // 'X' is defined by number 2
  row.num2 = countSign(3, rowInput); // '2' is defined by number 3

  row.probPct = calcProduct(bong.book, rowOutcome);
  row.poolProbPct = calcProduct(bong.pool, rowOutcome);
  // row.evProbPct = calcProduct(bong.ev, rowOutcome);
  // row.nvProbPct = calcProduct(bong.nv, rowOutcome);

  row.prob = 1 / row.probPct;
  row.poolProb = 1 / row.poolProbPct;
  // row.evProb = 1 / row.evProbPct;
  // row.nvProb = 1 / row.nvProbPct;

  row.estNum13R = bong.turnover / row.poolProb;
  row.estNum12R = 26 * row.estNum13R;
  row.estNum11R = 312 * row.estNum13R;
  row.estNum10R = 3432 * row.estNum13R;

  row.estYield13R = row.estNum13R < 1 ? bong.pot13RAlone : bong.pot13R / (row.estNum13R + 1);
  row.estYield12R = util.minOrNone(MIN_PAYOUT, bong.pot12R / (row.estNum12R + 1));
  row.estYield11R = util.minOrNone(MIN_PAYOUT, bong.pot11R / (row.estNum11R + 1));
  row.estYield10R = util.minOrNone(MIN_PAYOUT, bong.pot10R / (row.estNum10R + 1));

  row.prob = row.prob;

  row.ev =
    row.estYield13R * 1 * (1 / row.prob) +
    row.estYield12R * 26 * (1 / row.prob) +
    row.estYield11R * 312 * (1 / row.prob) +
    row.estYield10R * 3432 * (1 / row.prob);

  setProfits(bong, row);
  probRange.setProbRangeForRow(bong, row);

  if (useNumRange) {
    numRange.setNumRangeForRow(bong, row);
  }

  return row;
}

function createRowOutcome(rowInput) {
  const rowOutcome = new Map();

  rowOutcome.set(1, convertToSign(rowInput.m1));
  rowOutcome.set(2, convertToSign(rowInput.m2));
  rowOutcome.set(3, convertToSign(rowInput.m3));
  rowOutcome.set(4, convertToSign(rowInput.m4));
  rowOutcome.set(5, convertToSign(rowInput.m5));
  rowOutcome.set(6, convertToSign(rowInput.m6));
  rowOutcome.set(7, convertToSign(rowInput.m7));
  rowOutcome.set(8, convertToSign(rowInput.m8));
  rowOutcome.set(9, convertToSign(rowInput.m9));
  rowOutcome.set(10, convertToSign(rowInput.m10));
  rowOutcome.set(11, convertToSign(rowInput.m11));
  rowOutcome.set(12, convertToSign(rowInput.m12));
  rowOutcome.set(13, convertToSign(rowInput.m13));

  /*
  row.rowText =
    rowOutcome.get(1) +
    rowOutcome.get(2) +
    rowOutcome.get(3) +
    rowOutcome.get(4) +
    rowOutcome.get(5) +
    rowOutcome.get(6) +
    rowOutcome.get(7) +
    rowOutcome.get(8) +
    rowOutcome.get(9) +
    rowOutcome.get(10) +
    rowOutcome.get(11) +
    rowOutcome.get(12) +
    rowOutcome.get(13);

  row.num1 = row.rowText.split('1').length - 1;
  row.numX = row.rowText.split('X').length - 1;
  row.num2 = row.rowText.split('2').length - 1;
  
  row.num1 = countSign('1', rowOutcome);
  row.numX = countSign('X', rowOutcome);
  row.num2 = countSign('2', rowOutcome); 
  */

  return rowOutcome;
}

function setProfits(bong, row) {
  row.cost = 1;

  switch (row.numRight) {
    case 13:
      row.win = bong.yield13RPlus1;
      row.win2 = bong.yield13RPlus1NoJackpot;
      row.win3 = Math.min(bong.yield13RPlus1, bong.yield13RPlus1Avg);
      row.win4 = Math.min(bong.yield13RPlus1NoJackpot, bong.yield13RPlus1AvgNoJackpot);
      row.win5 = 0;
      break;
    case 12:
      row.win = bong.yield12RPlus1;
      row.win2 = bong.yield12RPlus1;
      row.win3 = bong.yield12RPlus1;
      row.win4 = bong.yield12RPlus1;
      row.win5 = bong.yield12RPlus1;
      break;
    case 11:
      row.win = bong.yield11R;
      row.win2 = bong.yield11R;
      row.win3 = bong.yield11R;
      row.win4 = bong.yield11R;
      row.win5 = bong.yield11R;
      break;
    case 10:
      row.win = bong.yield10R;
      row.win2 = bong.yield10R;
      row.win3 = bong.yield10R;
      row.win4 = bong.yield10R;
      row.win5 = bong.yield10R;
      break;
    default:
      row.win = 0;
      row.win2 = 0;
      row.win3 = 0;
      row.win4 = 0;
      row.win5 = 0;
  }

  row.profit = row.win - row.cost;
  row.profit2 = row.win2 - row.cost;
  row.profit3 = row.win3 - row.cost;
  row.profit4 = row.win4 - row.cost;
  row.profit5 = row.win5 - row.cost;
}

function countSign(sign, outcomes) {
  return (
    (sign == outcomes.m1 ? 1 : 0) +
    (sign == outcomes.m2 ? 1 : 0) +
    (sign == outcomes.m3 ? 1 : 0) +
    (sign == outcomes.m4 ? 1 : 0) +
    (sign == outcomes.m5 ? 1 : 0) +
    (sign == outcomes.m6 ? 1 : 0) +
    (sign == outcomes.m7 ? 1 : 0) +
    (sign == outcomes.m8 ? 1 : 0) +
    (sign == outcomes.m9 ? 1 : 0) +
    (sign == outcomes.m10 ? 1 : 0) +
    (sign == outcomes.m11 ? 1 : 0) +
    (sign == outcomes.m12 ? 1 : 0) +
    (sign == outcomes.m13 ? 1 : 0)
  );
}

function calcNumRight(rowOutcome, bongOutcome) {
  let numRight = 0;
  let i;
  for (i = 1; i <= 13; i++) {
    if (rowOutcome.get(i) === bongOutcome.get(i)) {
      numRight++;
    }
  }
  return numRight;
}

function calcProduct(values, rowOutcome) {
  let product = 1;
  let i;
  for (i = 1; i <= 13; i++) {
    product = product * (values.get(i).get(rowOutcome.get(i)) / 100);
  }
  return product;
}

function convertToSign(n) {
  switch (n) {
    case 1:
      return '1';
    case 2:
      return 'X';
    case 3:
      return '2';
    default:
      throw new Error('Unexpected input:' + n);
  }
}
