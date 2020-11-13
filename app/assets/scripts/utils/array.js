export function toggleValue(array, value) {
  array = [...array];
  let i = array.indexOf(value);
  if (i === -1) {
    array.push(value);
  } else {
    array.splice(i, 1);
  }
  return array;
}
