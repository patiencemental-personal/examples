import { useCallback, useState } from 'react';

export default function useLoading(value = false) {
  const [loading, setLoading] = useState(value);

  const startLoading = useCallback((ms) => {
    setLoading(true);
    if (ms) {
      setTimeout(() => {
        setLoading(false);
      }, ms);
    }
  }, []);
  const endLoading = useCallback(() => setLoading(false), []);

  const progressLoading = useCallback((callback) => {
    startLoading();
    const result = callback();
    endLoading();
    return result;
  }, [startLoading, endLoading]);

  // @TODO todo Implement
  // Not Work!!
  // const progressAsyncLoading = useCallback(async (callback) => {
  //   startLoading();
  //   const asyncResult = await callback();
  //   const stop = () => { endLoading(); };
  //   return [asyncResult, stop];
  // }, [startLoading, endLoading]);

  return [loading, startLoading, endLoading, progressLoading];
};