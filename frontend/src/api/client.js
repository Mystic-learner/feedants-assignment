import axios from 'axios';
import { Platform } from 'react-native';

// On Web or standard local dev, direct to 127.0.0.1:5000
const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://127.0.0.1:5000/api';
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://127.0.0.1:5000/api';
};

const client = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
