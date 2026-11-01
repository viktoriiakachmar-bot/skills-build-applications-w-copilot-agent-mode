import { useEffect, useState } from 'react';
import { getJson } from './client.js';

type ApiState<T> = { status: 'loading' } | { status: 'error' } | { status: 'success'; data: T };

export function useApiData<T>(path: string): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({ status: 'loading' });
  useEffect(() => {
    let active = true;
    setState({ status: 'loading' });
    getJson<T>(path).then(
      (data) => { if (active) setState({ status: 'success', data }); },
      () => { if (active) setState({ status: 'error' }); },
    );
    return () => { active = false; };
  }, [path]);
  return state;
}
