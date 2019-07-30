/**
 * Prevents widows on texts by replacing the space between the last
 * two words with a non-breaking space.
 *
 * Allows you to turn this:
 *  You have to see it to believe
 *  it
 *
 * into this:
 *  You have to see it to
 *  believe it
 *
 * &nbsp; = \u00A0
 */
export default function (string, breakBefore) {
  breakBefore = breakBefore || 22;

  string = string.replace(/\u00A0([^\s]+)$/, ' $1');
  var s = string.split(' ');

  if (s.length > 1) {
    var l = s.length;
    var breakLength = (s[l - 1] + ' ' + s[l - 2]).length;
    if (breakBefore === 'always' || breakLength < breakBefore) {
      return string.replace(/\s([^\s]+)\s*$/, '\u00A0$1');
    }
  }
  return string;
}
