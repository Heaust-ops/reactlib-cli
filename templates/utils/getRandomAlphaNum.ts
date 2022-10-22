 /**
 * Generates a pseudo-random aplhanumeric of a given length
 * @param length Length of the alpha numeric string
 * @returns A random alpha numeric string of given length
 */
export const getRandomAlphaNum = (length: number) => {
  let text = "";
  for (let i = 0; i < length; i++) {
    text += Math.floor(Math.random() * 35).toString(36);
  }

  return text;
};
