'use strict';

// DECLARES -----------------------------------------------------------------------------

const log = require('./misc/log');
const csvUtil = require('./misc/csvUtil');
const bongLib = require('./bong');
const rowLib = require('./row');

// CONSTANTS -----------------------------------------------------------------------------

const USE_NUM_RANGE = true;

// FUNCTIONS -----------------------------------------------------------------------------

async function start(inputFilename = 'data/input.csv', outputFilename = 'data/output.csv') {
  log.debug('Start...');

  const bongs = await bongLib.readBongs(inputFilename);
  log.debug('Bongs to process:', bongs.length);

  const stream = csvUtil.createFileStream(outputFilename);

  let writeHeaders = true;
  let count = 0;
  const invalidBongs = new Array();

  bongs.forEach((bong) => {
    count++;
    log.debug(`Process bong ${count} of ${bongs.length}: ${bong.id}`);
    if (!bong.isValid) {
      invalidBongs.push(bong.id);
      log.debug(`Skipping invalid bong ${bong.id}`);
      return;
    }
    const stats = new Map();
    rowLib.createRows(bong, stats, USE_NUM_RANGE);
    const statsArray = bongLib.convertStatsToArray(stats);
    csvUtil.writeToFileStream({ data: statsArray, stream, writeHeaders });
    writeHeaders = false;
  });

  if (invalidBongs.length > 0) {
    log.debug(`--- ERROR: Skipped invalid bongs: ${invalidBongs}`);
  }

  csvUtil.closeFileStream(stream);

  log.debug('End!');
}

start();
