import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);

    // Old versions of Safari might not support addEventListener
    if (media.addEventListener) {
      media.addEventListener('change', listener);
    } else {
      media.addListener(listener); // Deprecated
    }

    // Initial check
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener);
      } else {
        media.removeListener(listener); // Deprecated
      }
    };
  }, [matches, query]);

  return matches;
};

export default useMediaQuery;
