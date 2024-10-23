import { useEffect, useState } from "react";

/**
 * @param {string} query. Should be in the format like "min-width: 100px"
 */
export function useMediaQuery(query: string): boolean | undefined {
  const [matches, setMatches] = useState<boolean>();

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const listener = () => setMatches(!!mediaQueryList.matches);
    listener();
    mediaQueryList.addEventListener("change", listener); // updated from .addListener
    return () => mediaQueryList.removeEventListener("change", listener); // updated from .removeListener
  }, [query]);

  return matches;
}
