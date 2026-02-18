import fetch from '@/utils/fetch';
import { ms } from '@/utils/date';
import qs from 'query-string';
import { any } from 'prop-types';
import { accessTokenStorage } from '@/utils/storage';

export const fetcher = (options = {}) => (url, params = '{}') => {
  return fetch({ url, ...options, ...JSON.parse(params) });
};

// DELETE fetcher yang aman
export const deleteFetcher = async (url, options = {}) => {
  const tokenObj = accessTokenStorage.get();
  const token = tokenObj?.value;

  if (!token) {
    throw new Error("Token tidak tersedia, user belum login atau belum disimpan");
  }

  // Gabungkan header dengan aman
  const headers = {
    Authorization: `Bearer ${token}`,
    ...(options.headers || {}),
  };

  // Bentuk config final
  const config = {
    ...options,
    headers,
    method: "DELETE", // pastikan ini override terakhir
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    throw new Error(`Gagal DELETE: ${res.status} ${res.statusText}`);
  }

  return res.json();
};



export const createQueryString = ({ params, arrayFormat = 'bracket' }) => {
  const filteredParams = Object
    .entries(params)
    .reduce((acc, [key, value]) => {
      if(value !== '') acc[key] = value;
      return acc;
    }, {});
  return qs.stringify(filteredParams, { arrayFormat });
};

export const createSwrKey = (url = '', { params = {}, arrayFormat = any } = {}) => `${url}?${createQueryString({ params, arrayFormat })}` ;

export const createSwrInfiniteKey = (url = '', index, { params, arrayFormat = any } = {}) => `${url}?page=${index + 1}&${createQueryString({ params, arrayFormat })}`;

export const defaultOptions = {
  shouldFetch: true,
  params: {},
  urlParams: {},
  items: [],
  dedupingInterval: 60000 // 1 minute
};

/* flattening data */
export const getInfiniteData = (data = []) => data.reduce(
  (acc, item) => [...acc, ...item.data],
  []
);

/* get meta from latest data */
export const getInfiniteMeta = (data = []) => data.length ? data[data.length - 1].meta : {};

export const getDedupingInterval = (interval) => {
  if(typeof interval === 'string'){
    return ms(interval);
  } 
  if(typeof interval === 'number') {
    return interval;
  } 
  return 60000; //1 minute
};

