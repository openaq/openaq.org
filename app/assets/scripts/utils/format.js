var d3 = require('d3');

export function formatPercent(n, upperLimit) {
  if ((n !== 0 && !n) || isNaN(n)) {
    return '-';
  }
  let pct = Math.round(parseFloat(n) * 100);
  if (
    typeof upperLimit !== 'undefined' &&
    !isNaN(upperLimit) &&
    pct > upperLimit
  ) {
    pct = upperLimit;
  }
  return pct + '%';
}

export function formatThousands(number, decimals = 2) {
  if (isNaN(number) || number === null) {
    return '-';
  }
  let n = d3.format(',.' + decimals + 'f')(number);
  return n.replace(new RegExp('\\.0{' + decimals + '}$'), '');
}

export function formatCurrency(number, decimals = 2) {
  if (number >= 1e9) {
    return d3.format(',.' + decimals + 'f')(number / 1e9) + '\u00A0B';
  }
  if (number >= 1e6) {
    return d3.format(',.' + decimals + 'f')(number / 1e6) + '\u00A0M';
  }
  return d3.format(',.' + decimals + 'f')(number);
}

export function round(number, decimals = 2) {
  return d3.format('.' + decimals + 'f')(number);
}

export function shortenLargeNumber(value, decimals = 2) {
  if (value / 1e9 >= 1) {
    value = round(value / 1e9, decimals) + 'B';
  } else if (value / 1e6 >= 1) {
    value = round(value / 1e6, decimals) + 'M';
  } else if (value / 1e3 >= 1) {
    value = round(value / 1e3, decimals) + 'k';
  }
  return value;
}
