// timestampService.js
import apiURL from '@/api/config';
import axios from 'axios';


// Function to fetch the current timestamp from the server
export const fetchTimestamp = async () => {
    try {
        const response = await axios.get(`${apiURL}/api/timestamp`);
        return response.data.timestamp;
    } catch (error) {
        console.error('Error fetching timestamp:', error);
        return null;
    }
};
