import axios, { AxiosRequestConfig } from 'axios';

export const newRequest = async (url: string, options?: AxiosRequestConfig) => {
  const instance = axios.create({
    ...options,
    timeout: 5000,
  });

  try {
    const response = await instance(url, options);
    if (response.data.length === 0) {
      return null;
    }
    return response;
  } catch (error) {
    return null;
  }
};
