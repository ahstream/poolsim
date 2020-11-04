'use strict';

// DECLARES -----------------------------------------------------------------------------

const log = require('./misc/log');
const util = require('./misc/util');

// FUNCTIONS -----------------------------------------------------------------------------

export function setProbEstForRow(bong, row) {
  // const isWithinProbEst25 = util.isWithinBaseRangeMinMax(bong.prob, row.prob, bong.minValProbEst25, bong.maxValProbEst25);
  const isWithinProbEst50 = util.isWithinBaseRangeMinMax(bong.prob, row.prob, bong.minValProbEst50, bong.maxValProbEst50);

  // row.costProbEst25 = isWithinProbEst25 ? 1 : 0;
  row.costProbEst50 = isWithinProbEst50 ? 1 : 0;

  // const winProbEst25 = isWithinProbEst25 ? row.win : 0;
  const winProbEst50 = isWithinProbEst50 ? row.win : 0;

  // row.profitProbEst25 = winProbEst25 - row.costProbEst25;
  row.profitProbEst50 = winProbEst50 - row.costProbEst50;
}

export function setProbEstForStat(stats) {
  // stats.costProbEst25 = 0;
  stats.costProbEst50 = 0;
  // stats.profitProbEst25 = 0;
  stats.profitProbEst50 = 0;
}

export function updateProbEstForStat(row, stats) {
  // stats.costProbEst25 = stats.costProbEst25 + row.costProbEst25;
  stats.costProbEst50 = stats.costProbEst50 + row.costProbEst50;
  // stats.profitProbEst25 = stats.profitProbEst25 + row.profitProbEst25;
  stats.profitProbEst50 = stats.profitProbEst50 + row.profitProbEst50;
}
