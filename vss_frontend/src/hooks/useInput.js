import { useCallback, useState } from 'react';

export default function useInput(init = '') {
  const [value, setValue] = useState(init);
  const changeValue = useCallback((event) => {
    setValue(event.target.value);
  }, []);
  return [value, changeValue];
};