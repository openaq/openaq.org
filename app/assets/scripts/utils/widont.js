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
export default function widont(string, breakBefore = 12) {
  const breakPoint = Math.max(string.length - breakBefore, 0);

  const left = string.substring(0, breakPoint);
  const right = string.substring(breakPoint);

  return left + right.replace(/ /g, '\u00A0');
}
