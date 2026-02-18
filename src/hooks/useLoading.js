import { useState, useCallback } from 'react';

export default function useLoading(defaultValue = false) {
  const [loading, setLoading] = useState(defaultValue);

  return [
    loading,
    useCallback(() => setLoading(true), []),
    useCallback(() => setLoading(false), []),
  ];
}
