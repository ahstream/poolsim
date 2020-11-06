'use strict';

// DECLARES -----------------------------------------------------------------------------

const log = require('./misc/log');
const mods = require('./mods');
const numRange = require('./numRange');
const probRange = require('./probRange');
const csvUtil = require('./misc/csvUtil');

// EXPORTED FUNCTIONS -----------------------------------------------------------------------------

export async function readBongs(filepath) {
  const source = await csvUtil.csvFileToJson(filepath, ';');
  const bongs = new Array();
  source.forEach((bongSource) => {
    bongs.push(parseBong(bongSource));
  });
  return bongs;
}

export function parseBong(bongSource) {
  const bong = {};

  bong.id = toNumber(bongSource.CouponId);
  bong.year = toNumber(bongSource.Year);
  bong.matchCount = toNumber(bongSource.MatchCount);

  bong.turnover = toNumber(bongSource.Turnover);
  bong.jackpot = toNumber(bongSource.Jackpot);

  bong.pot13R = toNumber(bongSource.Pot13R);
  bong.pot12R = toNumber(bongSource.Pot12R);
  bong.pot11R = toNumber(bongSource.Pot11R);
  bong.pot10R = toNumber(bongSource.Pot10R);
  bong.pot13RAlone = toNumber(bongSource.Pot13RAlone);

  bong.returnRate13R = toNumber(bongSource.ReturnRate13R);
  bong.returnRate12R = toNumber(bongSource.ReturnRate12R);
  bong.returnRate11R = toNumber(bongSource.ReturnRate11R);
  bong.returnRate10R = toNumber(bongSource.ReturnRate10R);

  bong.yield13RSrc = toNumber(bongSource.Yield13RSrc);
  bong.yield13RPlus1 = toNumber(bongSource.Yield13RPlus1);
  bong.yield12RPlus1 = toNumber(bongSource.Yield12RPlus1);
  bong.yield13RPlus1NoJackpot = toNumber(bongSource.Yield13RPlus1NoJackpot);
  bong.yield13RPlus1Avg = toNumber(bongSource.Yield13RPlus1Avg);
  bong.yield13RPlus1AvgNoJackpot = toNumber(bongSource.Yield13RPlus1AvgNoJackpot);

  bong.yield13R = toNumber(bongSource.Yield13R);
  bong.yield12R = toNumber(bongSource.Yield12R);
  bong.yield11R = toNumber(bongSource.Yield11R);
  bong.yield10R = toNumber(bongSource.Yield10R);

  bong.book1 = toNumber(bongSource.Book1);
  bong.bookX = toNumber(bongSource.BookX);
  bong.book2 = toNumber(bongSource.Book2);

  bong.bookHigh = toNumber(bongSource.BookHigh);
  bong.bookMid = toNumber(bongSource.BookMid);
  bong.bookLow = toNumber(bongSource.BookLow);

  bong.num1 = toNumber(bongSource.Num1);
  bong.numX = toNumber(bongSource.NumX);
  bong.num2 = toNumber(bongSource.Num2);

  bong.bookDifficulty = toNumber(bongSource.BookDifficulty);
  bong.poolDifficulty = toNumber(bongSource.PoolDifficulty);

  bong.poolHighOverplay = toNumber(bongSource.PoolHighOverplay);
  bong.poolHighOverplayTop3 = toNumber(bongSource.PoolHighOverplayTop3);

  bong.prob = toNumber(bongSource.RealProb13R);

  bong.realProb = toNumber(bongSource.RealProb13R);
  bong.realSum = toNumber(bongSource.RealSum13R);
  bong.realEv = toNumber(bongSource.RealEv);

  bong.estProb = toNumber(bongSource.EstProb13R);
  bong.estEv = toNumber(bongSource.EstEv);

  bong.poolProb = toNumber(bongSource.PoolProb13R);
  bong.poolSum = toNumber(bongSource.PoolSum13R);

  bong.isValid = true;

  fillSingleMap(bong, bongSource, 'outcome', 'Outcome');
  fillMultiMap(bong, bongSource, 'book', 'Book');
  fillMultiMap(bong, bongSource, 'pool', 'Pool');
  fillMultiMap(bong, bongSource, 'ev', 'Ev');
  fillMultiMap(bong, bongSource, 'nv', 'Nv');

  bong.estNum1 = Math.ceil((bong.book1 / 100) * 13);
  bong.estNumX = Math.floor((bong.bookX / 100) * 13);
  bong.estNum2 = Math.ceil((bong.book2 / 100) * 13);

  bong.estNum1Range1 = [bong.estNum1];
  bong.estNum1Range2 = [bong.estNum1 - 1, bong.estNum1];
  bong.estNum1Range3 = [bong.estNum1, bong.estNum1 + 1];
  bong.estNum1Range4 = [bong.estNum1 - 1, bong.estNum1, bong.estNum1 + 1];
  bong.estNum1Range5 = [bong.estNum1 - 2, bong.estNum1 - 1, bong.estNum1, bong.estNum1 + 1];
  bong.estNum1Range6 = [bong.estNum1 - 1, bong.estNum1, bong.estNum1 + 1, bong.estNum1 + 2];

  bong.estNumXRange1 = [bong.estNumX];
  bong.estNumXRange2 = [bong.estNumX - 1, bong.estNumX];
  bong.estNumXRange3 = [bong.estNumX, bong.estNumX + 1];
  bong.estNumXRange4 = [bong.estNumX - 1, bong.estNumX, bong.estNumX + 1];
  bong.estNumXRange5 = [bong.estNumX - 2, bong.estNumX - 1, bong.estNumX, bong.estNumX + 1];
  bong.estNumXRange6 = [bong.estNumX - 1, bong.estNumX, bong.estNumX + 1, bong.estNumX + 2];

  bong.estNum2Range1 = [bong.estNum2];
  bong.estNum2Range2 = [bong.estNum2 - 1, bong.estNum2];
  bong.estNum2Range3 = [bong.estNum2, bong.estNum2 + 1];
  bong.estNum2Range4 = [bong.estNum2 - 1, bong.estNum2, bong.estNum2 + 1];
  bong.estNum2Range5 = [bong.estNum2 - 2, bong.estNum2 - 1, bong.estNum2, bong.estNum2 + 1];
  bong.estNum2Range6 = [bong.estNum2 - 1, bong.estNum2, bong.estNum2 + 1, bong.estNum2 + 2];

  if (!bong.isValid) {
    log.debug(`Bong ${bong.id} is invalid and will be skipped!`);
  }

  return bong;
}

export function convertStatsToArray(bongStats) {
  const resultArr = new Array();
  bongStats.forEach((probObj, key) => {
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

export function addRowStats(row, bong, bongStats, useNumRange = false) {
  const probMod = mods.calcProbMod(row.prob);
  const evMod = mods.calcEvMod(row.ev);

  if (!bongStats.has(probMod)) {
    bongStats.set(probMod, new Map());
  }

  const probMap = bongStats.get(probMod);

  if (!probMap.has(evMod)) {
    const newStats = {
      bongId: bong.id,
      bongYear: bong.year,
      rows: 0,

      key: '',
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

      win2: 0,
      win3: 0,
      win4: 0,
      win5: 0,

      bongRealProb: bong.realProb,
      bongEstProb: bong.estProb,
      bongRealEv: bong.realEv,
      bongEstEv: bong.estEv,

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

      probSum: 0,
      evSum: 0,
    };

    if (useNumRange) {
      numRange.setNumRangeForStat(newStats);
    }
    probRange.setProbRangeForStat(newStats);

    mods.setKeys(row.prob, row.ev, newStats);
    mods.setProbMods(row.prob, newStats);
    mods.setEvMods(row.ev, newStats);

    probMap.set(evMod, newStats);
  }
  const stats = probMap.get(evMod);

  stats.cost = stats.cost + row.cost;

  stats.win = stats.win + row.win;
  stats.win2 = stats.win2 + row.win2;
  stats.win3 = stats.win3 + row.win3;
  stats.win4 = stats.win4 + row.win4;
  stats.win5 = stats.win5 + row.win5;

  stats.profit = stats.profit + row.profit;
  stats.profit2 = stats.profit2 + row.profit2;
  stats.profit3 = stats.profit3 + row.profit3;
  stats.profit4 = stats.profit4 + row.profit4;
  stats.profit5 = stats.profit5 + row.profit5;

  stats.probSum = stats.probSum + row.prob;
  stats.evSum = stats.evSum + row.ev;

  if (useNumRange) {
    numRange.updateNumRangeForStat(row, stats);
  }
  probRange.updateProbRangeForStat(row, stats);

  stats.rows++;
}

// HELPER FUNCTIONS -----------------------------------------------------------------------------

function fillSingleMap(bong, bongSource, key, prefix) {
  bong[key] = new Map();
  let i;
  for (i = 1; i <= 13; i++) {
    const thisVal = bongSource[prefix + 'M' + i];
    if (!validateNonEmptyInput(thisVal)) {
      bong.isValid = false;
    }
    bong[key].set(i, thisVal);
  }
}

function fillMultiMap(bong, bongSource, key, prefix) {
  bong[key] = new Map();
  let i;
  for (i = 1; i <= 13; i++) {
    const newMap = new Map();
    const thisVal1 = toNumber(bongSource[prefix + '1M' + i]);
    const thisValX = toNumber(bongSource[prefix + 'XM' + i]);
    const thisVal2 = toNumber(bongSource[prefix + '2M' + i]);
    if (!validateNonEmptyInput(thisVal1) || !validateNonEmptyInput(thisValX) || !validateNonEmptyInput(thisVal2)) {
      bong.isValid = false;
    }
    newMap.set('1', thisVal1);
    newMap.set('X', thisValX);
    newMap.set('2', thisVal2);
    bong[key].set(i, newMap);
  }
}

function validateNonEmptyInput(val) {
  switch (typeof val) {
    case 'string':
      return val !== '';
      break;
    case 'number':
      return val != 0;
      break;
    default:
      return true;
  }
}

function toNumber(s) {
  if (typeof s !== 'string') {
    return s;
  }
  const s2 = s.replace(/,/g, '.').replace(/ /g, '');
  const n = Number(s2);
  return n;
}
