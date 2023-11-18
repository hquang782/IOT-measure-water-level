import axios from 'axios';
import * as localStorage from '../util/LocalStorage';
import {
  checkAccessTokenExpiration,
  setAccessTokenWithExpiration,
} from '../util/CheckToken';
import { newRequest } from '../util/configApiRequest';

const API_URL = 'http://26.25.44.115:3000/auth/';

export const register = async (
  username: string,
  email: string,
  password: string,
  role:string,
) => {
  try {
    const response = await axios.post(API_URL + 'signup', {
      username,
      email,
      password,
      role,
    });
    const data = response.data;
    return data.message;
  } catch (error) {
    console.error('Error during signup:', error);
    return 'Network error! Please check your network.';
  }
};

export const login = async (username: string, password: string) => {
  try {
   

    const response = await newRequest(API_URL + 'signin', {
      method: 'POST',
      data: { username, password },
    }).then((data) => {
      return data?.data;
    });
    const data = response;
    console.log(data);

    if (data.access_token != null) {
  
      setAccessTokenWithExpiration(data); // xử lý access token
    }
    return data.message;
  } catch (error: any) {
    //xử lý lỗi
    console.log(error);
    if (error.response) {
      if (error.response.data.errors !== undefined)
        return error.response.data.errors[0].message;
    }
    return error.message;
  }
};

export const logout = () => {
  localStorage.removeUserFromStorage();
};

export const getCurrentUser = () => {
  const userStr = localStorage.getUserFromStorage();
  
  if (userStr) {
    checkAccessTokenExpiration();
    return userStr;
  }
  return null;
};
