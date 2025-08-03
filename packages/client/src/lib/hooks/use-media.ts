// Logic from https://github.com/streamich/react-use/blob/master/src/useMedia.ts

import { useState, useEffect } from "react";

export const media = {
  sm: "(width >= 40rem)",
  md: "(width >= 48rem)",
  lg: "(width >= 64rem)",
} as const;

type MediaQuery = (typeof media)[keyof typeof media];

function useMedia(query: MediaQuery) {
  const [state, setState] = useState(false);

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(!!mql.matches);
    };

    mql.addEventListener("change", onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeEventListener("change", onChange);
    };
  }, [query]);

  return state;
}

export default useMedia;
