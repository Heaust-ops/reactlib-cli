 /**
 * Returns the character counts of a string
 * @param arg The string you wnat the char count of
 * @returns a Dict of char counts
 * example: {
 *    "s": 2,
 *    "d": 2,
 *    "j": 1,
 *    "a": 2
 *  }
 */
export const getCharacterFrequency = (arg: string) => {
  return arg.split("").reduce((total: { [k: string]: number }, letter) => {
    total[letter] ? total[letter]++ : (total[letter] = 1);
    return total;
  }, {});
};
