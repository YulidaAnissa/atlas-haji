import fetch from '@/utils/fetch';
import { accessTokenStorage } from '@/utils/storage';
import { SERVICES } from '@/configs';

export async function postPerjalanan(data) {
  const options = {
    url: SERVICES.ADD_PERJALANAN,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessTokenStorage.get().value}`,
    },
    data
  };
  try {
    const response = await fetch(options);
    return response;
  } catch(error) {
    return Promise.reject(error);
  }
}
