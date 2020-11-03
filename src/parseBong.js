const log = require('./log');

export default function (bongSrc) {
  const bong = {};

  bong.id = toNumber(bongSrc.CouponId);
  bong.year = toNumber(bongSrc.Year);
  bong.matchCount = toNumber(bongSrc.MatchCount);
  bong.turnover = toNumber(bongSrc.Turnover);
  bong.jackpot = toNumber(bongSrc.Jackpot);
  bong.pot13R = toNumber(bongSrc.Pot13R);
  bong.pot12R = toNumber(bongSrc.Pot12R);
  bong.pot11R = toNumber(bongSrc.Pot11R);
  bong.pot10R = toNumber(bongSrc.Pot10R);
  bong.pot13RAlone = toNumber(bongSrc.Pot13RAlone);
  bong.returnRate13R = toNumber(bongSrc.ReturnRate13R);
  bong.returnRate12R = toNumber(bongSrc.ReturnRate12R);
  bong.returnRate11R = toNumber(bongSrc.ReturnRate11R);
  bong.returnRate10R = toNumber(bongSrc.ReturnRate10R);
  bong.yield13RSrc = toNumber(bongSrc.Yield13RSrc);
  bong.yield13RPlus1 = toNumber(bongSrc.Yield13RPlus1);
  bong.yield12RPlus1 = toNumber(bongSrc.Yield12RPlus1);
  bong.yield13RPlus1NoJackpot = toNumber(bongSrc.Yield13RPlus1NoJackpot);
  bong.yield13RPlus1Avg = toNumber(bongSrc.Yield13RPlus1Avg);
  bong.yield13RPlus1AvgNoJackpot = toNumber(bongSrc.Yield13RPlus1AvgNoJackpot);
  bong.yield13R = toNumber(bongSrc.Yield13R);
  bong.yield12R = toNumber(bongSrc.Yield12R);
  bong.yield11R = toNumber(bongSrc.Yield11R);
  bong.yield10R = toNumber(bongSrc.Yield10R);
  bong.poolProb13R = toNumber(bongSrc.PoolProb13R);
  bong.realProb13R = toNumber(bongSrc.RealProb13R);
  bong.estProb12R = toNumber(bongSrc.EstProb12R);
  bong.estProb11R = toNumber(bongSrc.EstProb11R);
  bong.estProb10R = toNumber(bongSrc.EstProb10R);

  bong.poolSum13R = toNumber(bongSrc.PoolSum13R);
  bong.realSum13R = toNumber(bongSrc.RealSum13R);

  bong.realEv = toNumber(bongSrc.RealEv);
  bong.estEv = toNumber(bongSrc.EstEv);
  bong.estEvType2 = toNumber(bongSrc.EstEvType2);

  bong.book1 = toNumber(bongSrc.Book1);
  bong.bookX = toNumber(bongSrc.BookX);
  bong.book2 = toNumber(bongSrc.Book2);

  bong.bookHigh = toNumber(bongSrc.BookHigh);
  bong.bookMid = toNumber(bongSrc.BookMid);
  bong.bookLow = toNumber(bongSrc.BookLow);

  bong.num1 = toNumber(bongSrc.Num1);
  bong.numX = toNumber(bongSrc.NumX);
  bong.num2 = toNumber(bongSrc.Num2);

  bong.bookProb = toNumber(bongSrc.RealProb13R);
  bong.bookEv = toNumber(bongSrc.EstEv);

  bong.bookDifficulty = toNumber(bongSrc.BookDifficulty);
  bong.poolDifficulty = toNumber(bongSrc.PoolDifficulty);

  bong.poolHighOverplay = toNumber(bongSrc.PoolHighOverplay);
  bong.poolHighOverplayTop3 = toNumber(bongSrc.PoolHighOverplayTop3);

  bong.isValid = true;

  fillSingleMap(bong, bongSrc, 'outcome', 'Outcome');
  fillMultiMap(bong, bongSrc, 'book', 'Book');
  fillMultiMap(bong, bongSrc, 'pool', 'Pool');
  fillMultiMap(bong, bongSrc, 'ev', 'Ev');
  fillMultiMap(bong, bongSrc, 'nv', 'Nv');

  bong.estNum1 = Math.ceil((bong.book1 / 100) * 13);
  bong.estNumX = Math.floor((bong.bookX / 100) * 13);
  bong.estNum2 = Math.ceil((bong.book2 / 100) * 13);

  bong.estNum1Range1 = [bong.estNum1];
  bong.estNum1Range2 = [bong.estNum1 - 1, bong.estNum1];
  bong.estNum1Range3 = [bong.estNum1, bong.estNum1 + 1];
  bong.estNum1Range4 = [bong.estNum1 - 1, bong.estNum1, bong.estNum1 + 1];

  bong.estNumXRange1 = [bong.estNumX];
  bong.estNumXRange2 = [bong.estNumX - 1, bong.estNumX];
  bong.estNumXRange3 = [bong.estNumX, bong.estNumX + 1];
  bong.estNumXRange4 = [bong.estNumX - 1, bong.estNumX, bong.estNumX + 1];

  bong.estNum2Range1 = [bong.estNum2];
  bong.estNum2Range2 = [bong.estNum2 - 1, bong.estNum2];
  bong.estNum2Range3 = [bong.estNum2, bong.estNum2 + 1];
  bong.estNum2Range4 = [bong.estNum2 - 1, bong.estNum2, bong.estNum2 + 1];

  if (!bong.isValid) {
    log.debug(`Bong ${bong.id} is invalid and will be skipped!`);
  }

  return bong;
}

function fillSingleMap(bong, bongSrc, key, prefix) {
  bong[key] = new Map();
  let i;
  for (i = 1; i <= 13; i++) {
    const thisVal = bongSrc[prefix + 'M' + i];
    if (!validateNonEmptyInput(thisVal)) {
      bong.isValid = false;
    }
    bong[key].set(i, thisVal);
  }
}

function fillMultiMap(bong, bongSrc, key, prefix) {
  bong[key] = new Map();
  let i;
  for (i = 1; i <= 13; i++) {
    const newMap = new Map();
    const thisVal1 = toNumber(bongSrc[prefix + '1M' + i]);
    const thisValX = toNumber(bongSrc[prefix + 'XM' + i]);
    const thisVal2 = toNumber(bongSrc[prefix + '2M' + i]);
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
