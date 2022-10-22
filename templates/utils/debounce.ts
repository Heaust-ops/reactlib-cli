 /**
 * @param func the function to perform
 * @param delay the duration of debounce
 * @returns A function that can only be used every "delay" seconds
 */
export const debounce = (func: Function, delay: number) => {
  let debounceTimer: NodeJS.Timer;
  return function (this: void) {
    const context = this;
    const args = arguments;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(context, args), delay);
  };
};
