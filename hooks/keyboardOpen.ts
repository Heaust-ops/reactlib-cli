 import { useEffect, useState } from "react";

/**
 * A hook that keeps track of virtual keyboard being open in
 * mobile and touch devices
 *
 * @param defaultValue Whether the keyboard is open initially
 * @param minKeyboardHeight threshold height for keyboard
 * @returns a state that keeps tracks of the keyboard being open
 * 
 * Use it like so,
 * const isMobileKeyboardOpen = useDetectKeyboardOpen(false);
 */
const useDetectKeyboardOpen = (
  defaultValue = false,
  minKeyboardHeight = 300
) => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(defaultValue);

  useEffect(() => {
    const listener = () => {
      if (!window.visualViewport) return;
      const newState =
        window.screen.height - minKeyboardHeight > window.visualViewport.height;
      setIsKeyboardOpen(newState);
    };
    if (window.visualViewport)
      window.visualViewport.addEventListener("resize", listener);
    return () => {
      if (window.visualViewport)
        window.visualViewport.removeEventListener("resize", listener);
    };
  }, [minKeyboardHeight]);

  return isKeyboardOpen;
};

export default useDetectKeyboardOpen;
