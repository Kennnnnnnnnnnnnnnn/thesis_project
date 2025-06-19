
import apiURL from '@/api/config';
import axios from 'axios';

export const fetchTimestamp = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`${apiURL}/api/timestamp`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data.timestamp;
};
