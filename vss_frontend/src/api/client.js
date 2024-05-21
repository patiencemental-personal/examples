import axios from 'axios'
import { setInterceptors } from './interceptors';

// create instance
const create = (config) => {
    const instance = axios.create(config);
    setInterceptors(instance);
    return instance;
}

const defaultConfig = {
  baseURL: process.env.REACT_APP_BASE_ORIGIN2,
  withCredentials: true,
};

export const client = create(defaultConfig);