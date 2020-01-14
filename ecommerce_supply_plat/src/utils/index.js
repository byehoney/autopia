export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}
export function swapItems(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  
  return arr;
};
export function upRecord(arr, $index) {
  if($index == 0) {
      return;
  }
  return swapItems(arr, $index, $index - 1);
};
export function downRecord(arr, $index) {
  if($index == arr.length -1) {
      return;
  }
  return swapItems(arr, $index, $index + 1);
};

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @returns {Array}
 */
export function diffArary(arr1, arr2) {
  arr1 = uniqueArr(arr1)
  arr2 = uniqueArr(arr2)
  return arr1.concat(arr2).filter(arg => !(arr1.includes(arg)  && arr2.includes(arg)))
}
