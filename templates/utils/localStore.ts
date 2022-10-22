/**
 * Local Store Utility
 *
 * A utility that boilerplates some of the functionality of working
 * with localstorage for all JSON serializable objects
 *
 * @param name The key to save our value by
 * @param defaultValue the default to the value
 * @returns A getter, A setter and a remover
 *
 * Use it like so,
 *
 * const [ getTheme, setTheme, clearTheme ] = localStore("theme", "dark");
 *
 * setTheme("light")
 *
 * getTheme()
 *
 * clearTheme()
 */
const localStore = <T>(name: string, defaultValue: T) => {
  /**
   * Serializes and saves the given value to localstorage
   * @param value The value to save
   */
  const setter = (value: T) => {
    localStorage.setItem(name, JSON.stringify(value));
  };

  /**
   * Parses and returns the saved value,
   * saves and returns the default value if no value is set
   * @returns the parsed saved or default value
   */
  const getter = () => {
    const item = localStorage.getItem(name);
    if (!item) {
      setter(defaultValue);
      return defaultValue;
    }
    return JSON.parse(item);
  };

  /**
   * Removes the item from localstorage
   */
  const remover = () => {
    localStorage.removeItem(name);
  };

  return [getter, setter, remover] as [() => T, (val: T) => void, () => void];
};
