'use strict';

const tools = require('./tools');
const log = require('./log');
const csvUtil = require('./csvUtil');

import parseBong from './parseBong';

const MIN_PAYOUT = 15;

const M20 = 20000000;
const M10 = 10000000;
const M5 = 5000000;
const M1 = 1000000;
const K500 = 500000;
const K100 = 100000;
const K50 = 50000;

async function readBongs(filepath) {
  const bongsSrc = await tools.csvFileToJson(filepath, ';');
  const bongs = new Array();
  bongsSrc.forEach((bongSrc) => {
    bongs.push(parseBong(bongSrc));
  });
  return bongs;
}

function calcProbMod(val) {
  if (val > M20) {
    return M20;
  }

  let divider;
  if (val > M10) {
    divider = M1;
  } else if (val > M5) {
    divider = K500;
  } else if (val > M1) {
    divider = K100;
  } else {
    divider = K50;
  }

  const mode = Math.ceil(val / divider) * divider;
  if (mode.toString() === 'NaN') {
    log.debug('NaN:', val, divider, val / divider, Math.ceil(val / divider), Math.ceil(val / divider) * divider);
  }
  return mode;
}

function calcProbModCustom(val, divider) {
  if (val > M20) {
    return M20;
  }
  const mode = Math.ceil(val / divider) * divider;
  return mode;
}

function calcEvMod(val) {
  if (val > 15) {
    return 15;
  }

  let divider;
  if (val > 10) {
    divider = 1;
  } else if (val > 5) {
    divider = 0.5;
  } else {
    divider = 0.1;
  }
  const intRatio = 1000;
  const intDivider = divider * intRatio;
  const intVal = val * intRatio;

  const mode = (Math.ceil(intVal / intDivider) * intDivider) / intRatio;
  return mode;
}

function calcEvModCustom(val, divider) {
  if (val > 15) {
    return 15;
  }

  const intRatio = 1000;
  const intDivider = divider * intRatio;
  const intVal = val * intRatio;

  const mode = (Math.ceil(intVal / intDivider) * intDivider) / intRatio;
  return mode;
}

function setProbMods(val, target) {
  target.probModMain1 = calcProbMod(val);
  target.probModMain2 = calcProbMod(val);
  target.probModGui = (calcProbMod(val) / M1).toString();

  target.probModK1 = calcProbModCustom(val, 100000);
  target.probModK2 = calcProbModCustom(val, 200000);
  target.probModK3 = calcProbModCustom(val, 300000);
  target.probModK4 = calcProbModCustom(val, 400000);
  target.probModK5 = calcProbModCustom(val, 500000);
  target.probModK6 = calcProbModCustom(val, 600000);
  target.probModK7 = calcProbModCustom(val, 700000);
  target.probModK8 = calcProbModCustom(val, 800000);
  target.probModK9 = calcProbModCustom(val, 900000);
  target.probModK10 = calcProbModCustom(val, 1000000);
}

function setEvMods(val, target) {
  target.evModMain1 = calcEvMod(val);
  target.evModMain2 = calcEvMod(val);
  target.evModGui = calcEvMod(val).toString();

  target.evModK1 = calcEvModCustom(val, 0.1);
  target.evModK2 = calcEvModCustom(val, 0.2);
  target.evModK3 = calcEvModCustom(val, 0.3);
  target.evModK4 = calcEvModCustom(val, 0.4);
  target.evModK5 = calcEvModCustom(val, 0.5);
  target.evModK6 = calcEvModCustom(val, 0.6);
  target.evModK7 = calcEvModCustom(val, 0.7);
  target.evModK8 = calcEvModCustom(val, 0.8);
  target.evModK9 = calcEvModCustom(val, 0.9);
  target.evModK10 = calcEvModCustom(val, 1.0);
}

function convertBongStatToArray(bongStat) {
  const resultArr = new Array();
  bongStat.forEach((probObj, key) => {
    probObj.forEach((statObj, key2) => {
      statObj.probSum = Math.floor(statObj.probSum);
      statObj.evSum = Math.round(statObj.evSum * 100) / 100;

      statObj.probAvg = Math.floor(statObj.probSum / statObj.rows);
      const evAvg = statObj.evSum / statObj.rows;
      statObj.evAvg = Number.isInteger(evAvg) ? evAvg : Math.round(evAvg * 100) / 100;

      resultArr.push(statObj);
    });
  });
  return resultArr;
}

function addToBongStat(row, bong, bongStat) {
  const probMod = calcProbMod(row.prob);
  const evMod = calcEvMod(row.ev);

  if (!bongStat.has(probMod)) {
    bongStat.set(probMod, new Map());
  }

  const probMap = bongStat.get(probMod);

  if (!probMap.has(evMod)) {
    const newStats = {
      bongId: bong.id,
      bongYear: bong.year,
      rows: 0,

      key: (probMod / M1).toString() + '_' + evMod.toString(),
      probMod,
      evMod,

      probAvg: 0,
      evAvg: 0,

      cost: 0,
      win: 0,
      profit: 0,

      profit2: 0,
      profit3: 0,
      profit4: 0,
      profit5: 0,

      profitSign10: 0,
      profitSign11: 0,
      profitSignX0: 0,
      profitSignX1: 0,
      profitSign20: 0,
      profitSign21: 0,

      win2: 0,
      win3: 0,
      win4: 0,
      win5: 0,

      winSign10: 0,
      winSign11: 0,
      winSignX0: 0,
      winSignX1: 0,
      winSign20: 0,
      winSign21: 0,

      costSign10: 0,
      costSign11: 0,
      costSignX0: 0,
      costSignX1: 0,
      costSign20: 0,
      costSign21: 0,

      probSum: 0,
      evSum: 0,
      prob13R: bong.bookProb,

      // book1: bong.book1,
      // bookX: bong.bookX,
      // book2: bong.book2,
      // bookHigh: bong.bookHigh,
      // bookMid: bong.bookMid,
      bongBookLow: bong.bookLow,
      // num1: bong.num1,
      // numX: bong.numX,
      // num2: bong.num2,
      bongBookDifficulty: bong.bookDifficulty,
      bongPoolDifficulty: bong.poolDifficulty,
      bongPoolHighOverplay: bong.poolHighOverplay,
      bongPoolHighOverplayTop3: bong.poolHighOverplayTop3,
    };

    setProbMods(row.prob, newStats);
    setEvMods(row.ev, newStats);
    setNumRangeForStat(bong, row, newStats);

    probMap.set(evMod, newStats);
  }
  const stats = probMap.get(evMod);

  stats.cost = stats.cost + row.cost;

  stats.costSign10 = stats.costSign10 + row.costSign10;
  stats.costSign11 = stats.costSign11 + row.costSign11;
  stats.costSignX0 = stats.costSignX0 + row.costSignX0;
  stats.costSignX1 = stats.costSignX1 + row.costSignX1;
  stats.costSign20 = stats.costSign20 + row.costSign20;
  stats.costSign21 = stats.costSign21 + row.costSign21;

  stats.win = stats.win + row.win;
  stats.win2 = stats.win2 + row.win2;
  stats.win3 = stats.win3 + row.win3;
  stats.win4 = stats.win4 + row.win4;
  stats.win5 = stats.win5 + row.win5;

  stats.winSign10 = stats.winSign10 + row.winSign10;
  stats.winSign11 = stats.winSign11 + row.winSign11;
  stats.winSignX0 = stats.winSignX0 + row.winSignX0;
  stats.winSignX1 = stats.winSignX1 + row.winSignX1;
  stats.winSign20 = stats.winSign20 + row.winSign20;
  stats.winSign21 = stats.winSign21 + row.winSign21;

  stats.profit = stats.profit + row.profit;
  stats.profit2 = stats.profit2 + row.profit2;
  stats.profit3 = stats.profit3 + row.profit3;
  stats.profit4 = stats.profit4 + row.profit4;
  stats.profit5 = stats.profit5 + row.profit5;

  stats.profitSign10 = stats.profitSign10 + row.profitSign10;
  stats.profitSign11 = stats.profitSign11 + row.profitSign11;
  stats.profitSignX0 = stats.profitSignX0 + row.profitSignX0;
  stats.profitSignX1 = stats.profitSignX1 + row.profitSignX1;
  stats.profitSign20 = stats.profitSign20 + row.profitSign20;
  stats.profitSign21 = stats.profitSign21 + row.profitSign21;

  stats.probSum = stats.probSum + row.prob;
  stats.evSum = stats.evSum + row.ev;

  updateNumRangeForStat(bong, row, stats);

  stats.rows++;
}

function createRow(bong, rowInput) {
  const row = {};

  row.bongId = bong.id;
  row.rowNumber = rowInput.rowNumber;

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

  row.numRight = calcNumRight(rowOutcome, bong.outcome);

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

  row.num1 = countSign2(1, rowInput); // '1' is defined by number 1
  row.numX = countSign2(2, rowInput); // 'X' is defined by number 2
  row.num2 = countSign2(3, rowInput); // '2' is defined by number 3

  row.bookProbPct = calcProduct(bong.book, rowOutcome);
  row.poolProbPct = calcProduct(bong.pool, rowOutcome);
  // row.evProbPct = calcProduct(bong.ev, rowOutcome);
  // row.nvProbPct = calcProduct(bong.nv, rowOutcome);

  row.bookProb = 1 / row.bookProbPct;
  row.poolProb = 1 / row.poolProbPct;
  // row.evProb = 1 / row.evProbPct;
  // row.nvProb = 1 / row.nvProbPct;

  row.estNum13R = bong.turnover / row.poolProb;
  row.estNum12R = 26 * row.estNum13R;
  row.estNum11R = 312 * row.estNum13R;
  row.estNum10R = 3432 * row.estNum13R;

  row.estYield13R = row.estNum13R < 1 ? bong.pot13RAlone : bong.pot13R / (row.estNum13R + 1);
  row.estYield12R = minOrNone(MIN_PAYOUT, bong.pot12R / (row.estNum12R + 1));
  row.estYield11R = minOrNone(MIN_PAYOUT, bong.pot11R / (row.estNum11R + 1));
  row.estYield10R = minOrNone(MIN_PAYOUT, bong.pot10R / (row.estNum10R + 1));

  row.prob = row.bookProb;
  row.ev =
    row.estYield13R * 1 * (1 / row.bookProb) +
    row.estYield12R * 26 * (1 / row.bookProb) +
    row.estYield11R * 312 * (1 / row.bookProb) +
    row.estYield10R * 3432 * (1 / row.bookProb);

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

  row.winSign10 = bong.estNum1 !== row.num1 ? row.win : 0;
  row.winSign11 = bong.estNum1 === row.num1 ? row.win : 0;
  row.costSign10 = bong.estNum1 !== row.num1 ? 1 : 0;
  row.costSign11 = bong.estNum1 === row.num1 ? 1 : 0;

  row.winSignX0 = bong.estNumX !== row.numX ? row.win : 0;
  row.winSignX1 = bong.estNumX === row.numX ? row.win : 0;
  row.costSignX0 = bong.estNumX !== row.numX ? 1 : 0;
  row.costSignX1 = bong.estNumX === row.numX ? 1 : 0;

  row.winSign20 = bong.estNum2 !== row.num2 ? row.win : 0;
  row.winSign21 = bong.estNum2 === row.num2 ? row.win : 0;
  row.costSign20 = bong.estNum2 !== row.num2 ? 1 : 0;
  row.costSign21 = bong.estNum2 === row.num2 ? 1 : 0;

  row.profit = row.win - row.cost;
  row.profit2 = row.win2 - row.cost;
  row.profit3 = row.win3 - row.cost;
  row.profit4 = row.win4 - row.cost;
  row.profit5 = row.win5 - row.cost;

  row.profitSign10 = row.winSign10 - row.costSign10;
  row.profitSign11 = row.winSign11 - row.costSign11;

  row.profitSignX0 = row.winSignX0 - row.costSignX0;
  row.profitSignX1 = row.winSignX1 - row.costSignX1;

  row.profitSign20 = row.winSign20 - row.costSign20;
  row.profitSign21 = row.winSign21 - row.costSign21;

  row.isWin = row.win > 0 ? 1 : 0;
  row.isWin2 = row.win2 > 0 ? 1 : 0;
  row.isWin3 = row.win3 > 0 ? 1 : 0;
  row.isWin4 = row.win4 > 0 ? 1 : 0;
  row.isWin5 = row.win5 > 0 ? 1 : 0;

  row.isProfit = row.profit > 0 ? 1 : 0;
  row.isProfit2 = row.profit2 > 0 ? 1 : 0;
  row.isProfit3 = row.profit3 > 0 ? 1 : 0;
  row.isProfit4 = row.profit4 > 0 ? 1 : 0;
  row.isProfit5 = row.profit5 > 0 ? 1 : 0;

  row.isEvPlus = row.ev > 1 ? 1 : 0;

  setNumRangeForRow(bong, row);

  return row;

  function minOrNone(min, val) {
    return val < min ? 0 : val;
  }
}

function setNumRangeForRow(row, bong) {
  row.isInNum1Range1 = bong.estNum1Range1.includes(row.num1);
  row.isInNum1Range2 = bong.estNum1Range2.includes(row.num1);
  row.isInNum1Range3 = bong.estNum1Range3.includes(row.num1);
  row.isInNum1Range4 = bong.estNum1Range4.includes(row.num1);

  row.costNum1RangeIn1 = row.isInNum1Range1 ? 1 : 0;
  row.costNum1RangeIn2 = row.isInNum1Range2 ? 1 : 0;
  row.costNum1RangeIn3 = row.isInNum1Range3 ? 1 : 0;
  row.costNum1RangeIn4 = row.isInNum1Range4 ? 1 : 0;

  row.winNum1RangeIn1 = row.isInNum1Range1 ? row.win : 0;
  row.winNum1RangeIn2 = row.isInNum1Range2 ? row.win : 0;
  row.winNum1RangeIn3 = row.isInNum1Range3 ? row.win : 0;
  row.winNum1RangeIn4 = row.isInNum1Range4 ? row.win : 0;

  row.profitNum1RangeIn1 = row.winNum1RangeIn1 - row.costNum1RangeIn1;
  row.profitNum1RangeIn2 = row.winNum1RangeIn2 - row.costNum1RangeIn2;
  row.profitNum1RangeIn3 = row.winNum1RangeIn3 - row.costNum1RangeIn3;
  row.profitNum1RangeIn4 = row.winNum1RangeIn4 - row.costNum1RangeIn4;

  row.costNum1RangeOut1 = !row.isInNum1Range1 ? 1 : 0;
  row.costNum1RangeOut2 = !row.isInNum1Range2 ? 1 : 0;
  row.costNum1RangeOut3 = !row.isInNum1Range3 ? 1 : 0;
  row.costNum1RangeOut4 = !row.isInNum1Range4 ? 1 : 0;

  row.winNum1RangeOut1 = !row.isInNum1Range1 ? row.win : 0;
  row.winNum1RangeOut2 = !row.isInNum1Range2 ? row.win : 0;
  row.winNum1RangeOut3 = !row.isInNum1Range3 ? row.win : 0;
  row.winNum1RangeOut4 = !row.isInNum1Range4 ? row.win : 0;

  row.profitNum1RangeOut1 = row.winNum1RangeOut1 - row.costNum1RangeOut1;
  row.profitNum1RangeOut2 = row.winNum1RangeOut2 - row.costNum1RangeOut2;
  row.profitNum1RangeOut3 = row.winNum1RangeOut3 - row.costNum1RangeOut3;
  row.profitNum1RangeOut4 = row.winNum1RangeOut4 - row.costNum1RangeOut4;
}

function setNumRangeForStat(bong, row, stats) {}

function updateNumRangeForStat(bong, row, stats) {}

function countSign(sign, outcomes) {
  let count = 0;
  outcomes.forEach((value, key) => {
    if (value == sign) {
      count++;
    }
  });
  return count;
}

function countSign2(sign, outcomes) {
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

function createBongRows(bong, bongStat) {
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
                            const row = createRow(bong, rowInput);
                            // bongRows.push(row);
                            addToBongStat(row, bong, bongStat);
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

function isWithingBaseRange(value, baseValue, withinPercent) {
  const minValue = baseValue * (1 - withinPercent);
  const maxValue = baseValue * (1 + withinPercent);
  return value >= minValue && value <= maxValue ? 1 : 0;
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

function openFileStream(filename) {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
  var stream = fs.createWriteStream(filename, { flags: 'a' });
  return stream;
}

function closeFileStream(stream) {
  stream.end();
}

async function start() {
  log.debug('Start...');
  const bongs = await readBongs('data/input.csv');
  log.debug('Bongs to process:', bongs.length);
  const filename = 'data/output.csv';
  const stream = csvUtil.createFileStream(filename);
  let writeHeaders = true;
  const invalidBongs = new Array();
  let count = 0;
  bongs.forEach((bong) => {
    count++;
    log.debug(`Process bong ${count} of ${bongs.length}: ${bong.id}`);
    if (!bong.isValid) {
      invalidBongs.push(bong.id);
      log.debug(`Skipping invalid bong ${bong.id}`);
      return;
    }
    const bongStat = new Map();
    createBongRows(bong, bongStat);
    const bongStatArray = convertBongStatToArray(bongStat);
    csvUtil.writeToFileStream({ data: bongStatArray, stream, writeHeaders });
    writeHeaders = false;
  });
  if (invalidBongs.length > 0) {
    log.debug(`--- ERROR: Skipped invalid bongs: ${invalidBongs}`);
  }
  csvUtil.closeFileStream(stream);
  log.debug('End!');
}

start();
