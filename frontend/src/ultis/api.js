import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const headers = {
  // Authorization: "bearer " + TOKEN
};

export const fetchDataFromAPI = async (url, params) => {
  try {
    const { data } = await axios.get(BASE_URL + url, {
      headers,
      params,
    });
    return data;
  } catch (error) {
    console.log(error);
    throw new Error(error || 'API call failed');
  }
};

export const postDataToAPI = async (url, body = {}) => {
  try {
    const { data } = await axios.post(BASE_URL + url, body, { headers });
    return data;
  } catch (error) {
    console.error('POST request error:', error.response);
    if (error.response && error.response.data) {
      if(error.response.data.errors && error.response.data.errors.length > 0) {
        const messages = error.response.data.errors
            .map(err => `${err.path}: ${err.msg}`)
            .join("; ");
        throw new Error(messages);
      }
      throw new Error(error.response.data.message || 'API call failed');
    }

    throw new Error(error || 'API call failed');
  }
};

export const putDataToAPI = async (url, body = {}) => {
  try {
    const { data } = await axios.put(BASE_URL + url, body, { headers });
    return data;
  } catch (error) {
    if (error.response && error.response.data) {
      if(error.response.data.errors && error.response.data.errors.length > 0) {
        const messages = error.response.data.errors
            .map(err => `${err.path}: ${err.msg}`)
            .join("; ");
        throw new Error(messages);
      }
      throw new Error(error.response.data.message || 'API call failed');
    }

    throw new Error(error || 'API call failed');
  }
};

export const deleteDataAPI = async (url, body = {}) => {
  try {
    const { data } = await axios.delete(BASE_URL + url, body, { headers });
    return data;
  } catch (error) {
    console.error('DELETE request error:', error.response);
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'API call failed');
    }

    throw new Error(error || 'API call failed');
  }
};
