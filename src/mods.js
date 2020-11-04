'use strict';

// DECLARES -----------------------------------------------------------------------------

const log = require('./misc/log');

// CONSTANTS -----------------------------------------------------------------------------

const M20 = 20000000;
const M10 = 10000000;
const M5 = 5000000;
const M1 = 1000000;
const K500 = 500000;
const K100 = 100000;
const K50 = 50000;

// FUNCTIONS -----------------------------------------------------------------------------

export function calcProbMod(val) {
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

export function calcProbModCustom(val, divider) {
  if (val > M20) {
    return M20;
  }
  const mode = Math.ceil(val / divider) * divider;
  return mode;
}

export function calcEvMod(val) {
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

export function calcEvModCustom(val, divider) {
  if (val > 15) {
    return 15;
  }

  const intRatio = 1000;
  const intDivider = divider * intRatio;
  const intVal = val * intRatio;

  const mode = (Math.ceil(intVal / intDivider) * intDivider) / intRatio;

  return mode;
}

export function setKeys(prob, ev, target) {
  target.key = calcProbMod(prob) + '_' + calcEvMod(ev);
  target.keyK1 = calcProbModCustom(prob, 100000) + '_' + calcEvModCustom(ev, 0.1);
  target.keyK2 = calcProbModCustom(prob, 200000) + '_' + calcEvModCustom(ev, 0.2);
  target.keyK3 = calcProbModCustom(prob, 300000) + '_' + calcEvModCustom(ev, 0.3);
  target.keyK4 = calcProbModCustom(prob, 400000) + '_' + calcEvModCustom(ev, 0.4);
  target.keyK5 = calcProbModCustom(prob, 500000) + '_' + calcEvModCustom(ev, 0.5);
}

export function setProbModsMovingAvg(val, target) {
  const probMod = calcProbModCustom(val, K100);
  const k3n1 = isWithin(val, 300000);
}

export function isWithin(value, minValue, maxValue) {
  return value >= minValue && value <= maxValue ? 1 : 0;
}

export function setProbMods(val, target) {
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

export function setEvMods(val, target) {
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
