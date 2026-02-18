import { useEffect } from 'react';

export default function useClickOutside (refs, callback) {
  const handleClick = e => {
    let shouldCallCallback = true;
    for(let i=0; i < refs?.length; i++) {
      const element = refs[i]?.current ? refs[i].current : refs[i];
      if (element && element?.contains?.(e.target)) {
        shouldCallCallback = false;
        break;
      }
    }

    if(shouldCallCallback) callback();
  };
  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });
}
